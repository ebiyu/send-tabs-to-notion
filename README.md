# onetab-notion

OneTabの保存先をNotionにしたものです。

## requiment

- node
- yarn (`npm i -g yarn` )

## インストール

1. Notionインテグレーションを作成
2. 該当ページにインテグレーションを追加
3. `.env` ファイルを作成し、Notion APIキーと追加先のAPIキーを記入

```
NOTION_API_KEY=secret_.....
NOTION_PAGE_ID=.....
```

4. `yarn build`
5. `chrome://extensions` にアクセスし、"Load unpacked" から `dist` を追加

