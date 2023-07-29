# Send tabs to Notion

Chrome拡張のOneTabの保存先をNotionにしたものです。

## requiment

- node
- yarn (`npm i -g yarn` )

## インストール

1. Notionインテグレーションを作成
2. 該当ページにインテグレーションを追加
3. `yarn && yarn build`
4. `chrome://extensions` にアクセスし、"Load unpacked" から `dist` を追加

初回利用でNotion APIキーとURLを聞かれます。
