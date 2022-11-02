# Slack Old File Keeper

Slack 公式で提供されているワークスペースエクスポート機能で出力された JSON ファイル群から、アップロードファイルの URL を検出して全件ダウンロードするためのアプリケーション。

## 使い方

```shell
$ npm ci
$ mkdir data
$ mv $EXPORTED_ZIP_FILE_PATH data
$ cd data
$ unzip $EXPORTED_ZIP_FILE_NAME
$ npm start
```

スクリプトの実行が完了されると

- `/files`: ダウンロードされたファイル
- `/files.json`: ダウンロードされたファイルの元URLと保存先パスの対応を記録したデータ

が出力される。