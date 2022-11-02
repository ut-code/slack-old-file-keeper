import * as uuid from "uuid";
import glob from "glob";
import fs from "fs";
import wget from "wget-improved";

fs.mkdirSync("files", { recursive: true });
const files = glob.sync("data/*/*.json");

const all = files
  .map((file) => fs.readFileSync(file, { encoding: "utf-8" }))
  .join("\n");
const rawUrls = all.match(/(?<=")https[^"]+/g);

/** @typedef {{ url: string, exportedFileName: string, error?: string }} ExportResult */
/** @type {Map<string, ExportResult>} */
const urlExportResultMap = new Map();

for (const rawUrl of rawUrls) {
  try {
    const url = JSON.parse(`"${rawUrl}"`);
    const urlObject = new URL(url);
    const fileName = urlObject.pathname.match(/[a-zA-Z0-9.\-_]+$/)?.[0];
    if (!fileName) continue;
    urlExportResultMap.set(url, {
      url,
      exportedFileName: `${uuid.v4()}_${fileName}`,
    });
  } catch {}
}

for (const [i, exportResult] of [...urlExportResultMap.values()].entries()) {
  console.log(
    `Processing ${exportResult.url} (${i + 1}/${urlExportResultMap.size})`
  );
  await new Promise((resolve) => {
    try {
      const download = wget.download(
        encodeURI(exportResult.url),
        `files/${exportResult.exportedFileName}`
      );
      download.on("error", (err) => {
        exportResult.error = String(err);
        console.log(err);
        resolve(null);
      });
      download.on("end", (result) => {
        console.log(result);
        resolve(null);
      });
    } catch (e) {
      exportResult.error = String(e);
      console.log(e);
      resolve(null);
    }
  });
}

fs.writeFileSync(
  "files.json",
  JSON.stringify([...urlExportResultMap.values()])
);
