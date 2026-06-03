# DALL-E 3 で記事ヘッダー画像を生成するスキル

指定した記事のタイトル・内容をもとにDALL-E 3で画像を生成し、記事のヘッダー画像として自動設定します。

## ステップ 1: 対象記事の特定

引数 `$ARGUMENTS` を確認してください。

- スラッグが指定されている場合（例: `guide/monstera-care`）→ その記事を直接使用
- タイトルや検索語の場合 → `content/` 以下をGrepして特定
- 未指定の場合 → ユーザーに確認

対象記事のmdファイルをReadして以下を取得：
- `title`（日本語）
- `description`
- `category`
- `tags`

## ステップ 2: DALL-E 3 プロンプトを生成

記事の内容から、以下のルールで英語プロンプトを作成してください：

**プロンプトのルール:**
- スタイル: `Professional botanical photography, natural lighting, shallow depth of field`
- 植物系記事（guide/species/soil）: 該当植物のクローズアップや自然な生育環境
- ギフト・レビュー系（research/review）: おしゃれなインテリア・フラットレイスタイル
- 必ず末尾に追加: `No text, no watermarks, no people, photorealistic, high quality`
- アスペクト比: 横長（1792x1024 を使用）

プロンプト例（モンステラの育て方記事の場合）:
```
Professional botanical photography of Monstera deliciosa plant in a bright indoor setting, large split leaves with natural light casting shadows, shallow depth of field, tropical plant in modern minimalist interior. No text, no watermarks, no people, photorealistic, high quality.
```

作成したプロンプトをユーザーに確認してから次のステップへ進んでください。

## ステップ 3: APIキーの確認

以下のBashコマンドでAPIキーを確認してください：

```bash
cat /Users/masashimatsubuchi/my-first-project/.env.local | grep OPENAI_API_KEY
```

`OPENAI_API_KEY=sk-...` が存在しない場合は、ユーザーに以下を伝えて停止：
> `.env.local` に `OPENAI_API_KEY=your-key` を追加してください。

## ステップ 4: DALL-E 3 で画像生成

以下のBashコマンドを実行してください（OPENAI_API_KEY は .env.local から読み込む）：

```bash
OPENAI_API_KEY=$(grep OPENAI_API_KEY /Users/masashimatsubuchi/my-first-project/.env.local | cut -d'=' -f2)

curl -s -X POST "https://api.openai.com/v1/images/generations" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "dall-e-3",
    "prompt": "【ステップ2で生成したプロンプト】",
    "n": 1,
    "size": "1792x1024",
    "quality": "standard",
    "response_format": "url"
  }'
```

レスポンスの `data[0].url` から画像URLを取得してください。

エラーの場合（401/429など）はエラー内容をユーザーに伝えて停止。

## ステップ 5: 画像をダウンロードして保存

スラッグからファイル名を生成（例: `guide/monstera-care` → `monstera-care-generated.jpg`）

```bash
curl -s -L "{画像URL}" -o "/Users/masashimatsubuchi/my-first-project/public/images/products/{ファイル名}"
```

保存先: `/images/products/{ファイル名}`

## ステップ 6: frontmatter を更新

対象記事の `image:` フィールドを `/images/products/{ファイル名}` に更新。

変更内容を表示してユーザーに確認：
```
変更前: [旧URL]
変更後: /images/products/{ファイル名}
```

## ステップ 7: commit & push

OKであれば：

```bash
cd /Users/masashimatsubuchi/my-first-project && git add content/{slug}.md public/images/products/{ファイル名} && git commit -m "Add AI-generated header image for {slug}" && git push
```

完了したらユーザーに報告してください。
