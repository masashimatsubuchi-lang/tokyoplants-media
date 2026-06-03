# 記事画像の追加・差し替えスキル

ユーザーが指定した記事に、最適な画像を探して設定するワークフローを実行してください。

## ステップ 1: 対象記事の特定

引数 `$ARGUMENTS` を確認してください。

- スラッグが指定されている場合（例: `guide/monstera-care`）→ その記事を直接使用
- タイトルや検索語が指定されている場合 → `content/` 以下のmdファイルをGrepして該当記事を特定
- 未指定の場合 → ユーザーに「どの記事の画像を変更しますか？」と聞く

対象記事が決まったら、frontmatterから以下を読み取ってください：
- `title`
- `description`
- `category`
- `tags`
- `image`（現在の画像URL）

## ステップ 2: 画像ソースの確認

ユーザーに以下を確認してください：

> 画像の取得元を選んでください：
> 1. **Unsplash** から検索（自動）
> 2. **ECサイト商品URL** を指定（例: https://www.tokyoplants.com/items/XXXXXX）
> 3. **ローカルファイル** のパスを指定

## ステップ 3a: Unsplash から検索する場合

記事の `title`・`description`・`tags` を参考に、英語の検索クエリを2〜3個生成してください。

各クエリで `https://unsplash.com/napi/search/photos?query={クエリ}&per_page=5&orientation=landscape` を WebFetch で取得し、`results` から以下を抽出：
- `id`
- `alt_description`
- `urls.regular`（または `urls.raw`）

人物・手・文字が写っていない植物・自然・インテリア系の写真を優先して3〜5枚候補を出してください。

候補を以下の形式でユーザーに提示：
```
候補 1: [alt_description]
候補 2: [alt_description]
候補 3: [alt_description]
```

ユーザーが番号を選んだら、選ばれた画像の `urls.regular` を取得して次のステップへ。
「自動で一番良いものを選んで」と言われた場合は、最もalt_descriptionが記事内容に関連するものを選択。

## ステップ 3b: ECサイト商品URLが指定された場合

指定されたURL（例: `https://www.tokyoplants.com/items/XXXXXX`）をWebFetchし、1枚目の商品画像URLを取得してください。

`baseec-img-mng.akamaized.net` ドメインの画像URLを探してください。

## ステップ 3c: ローカルファイルが指定された場合

ファイルが `/public/images/products/` にすでにある場合 → `/images/products/{filename}` として使用。
別の場所にある場合 → `public/images/products/` にコピーしてから使用。

## ステップ 4: frontmatter を更新

対象記事の `image:` フィールドを新しいURLに更新してください。

変更前後を確認：
```
変更前: [旧URL]
変更後: [新URL]
```

## ステップ 5: 確認とコミット

「この変更でよいですか？」とユーザーに確認。

OKであれば：
```bash
git add {記事のパス}
git commit -m "Update image for {slug}"
git push
```

を実行してデプロイ完了を報告してください。
