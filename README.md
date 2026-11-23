# memo-tasks-app

## 概要

メモとタスクを管理するためのWebアプリです。タスクとメモの追加・削除ができ、入力した内容はブラウザに保存されます。

## 公開URL

https://10618see-jpg.github.io/memo-tasks-app/

## 主な機能

- タスク・メモの追加（入力チェックつき）
- タスク・メモの削除
- タスクのステータス変更（進める・戻す）
- ブラウザ（`localStorage`）への保存と読み込み（不正なデータは読み込み時に除外）

## 使用技術

- HTML / CSS / JavaScript（フレームワークなし、ES Modules）
- Node.js（テストの実行に使用。Node 組み込みのテストランナー `node --test`）
- Git / GitHub

## ローカルでの開き方

ES Modules を使っているため、`index.html` をダブルクリックで開くと動きません。
VS Code の拡張機能 Live Server など、ローカルサーバー経由で開いてください。

## テスト方法

テストするにはNode.jsが必要です。

バージョンは `node -v` で確認できます。

次のコマンドでテストを実行します。

```
npm test
```

ステータスの遷移（進める・戻す）と、タスク・メモの入力チェックを確認する単体テストです（`rules.test.js`）。
