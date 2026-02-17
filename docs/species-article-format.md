# 植物図鑑記事フォーマット（species）

`/species/pothos-epipremnum-aureum` を基準に、今後の植物図鑑記事は以下の順序で作成する。

## Frontmatter

必須キー:

- `image`
- `title`
- `description`
- `date`
- `category: "species"`
- `author`

推奨キー:

- `tags`
- `relatedSlugs`
- `baseProducts`

## 本文構成（固定）

1. `## 基本情報`
2. `## 特徴`
3. `## 人気品種`
4. `## 育て方`
5. `## 増やし方`
6. `## 飾り方のバリエーション`
7. `## よくあるトラブル`
8. `## まとめ`

## 記述ルール

- 本文先頭に `# タイトル` を置かない（タイトルはfrontmatterで管理）
- `## 基本情報` は表形式で統一
- `## まとめ` は表で要点を再掲
- 末尾の「→ 関連商品リンク」「→ 関連カテゴリリンク」は入れない
