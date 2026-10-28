# 「よく読まれている記事」と、トップの人気ランキングの更新手順

GA4はビルド時に叩けないため、静的なJSONを月1回を目安に作り直します（2026-10-28 からスクリプトで自動集計）。

| ファイル | 使う場所 |
|---|---|
| `src/data/popular-articles.json` | 記事末尾の `PostScroller`（`eyebrow="Popular"`）と、トップの「よく読まれている記事」（上位9本） |
| `src/data/home-ranking.json` | トップの「人気ランキング」（Amazon、15位まで） |

## 手順

```bash
node scripts/update-popular.mjs --dry-run   # 結果だけ確認
node scripts/update-popular.mjs             # 書き出す（直近28日・昨日まで）
```

1. `--dry-run` で結果を見る。**「⚠️ 要確認」に商品が出たら**、内蔵ブラウザで商品ページを開いて
   当サイトのAmazon選定基準（★3.2以上・レビュー10件以上・出荷元Amazon・在庫あり）を確かめ、
   スクリプト冒頭の `APPROVED`（カード用の短い名前と画像URL）か `EXCLUDED`（理由つき）に足す。
   I'm original SOIL・HYDRO MINERAL の代わりになる土・培地は基準を満たしていても `EXCLUDED`。
2. 書き出して、差分を確認してコミットする。

- 認証は analytics-mcp と同じサービスアカウントのキー（`~/.config/ga4-mcp/key.json`、`GA4_KEY_FILE` で変更可）。
- 人気ランキングの並びは「その商品を `amazonProducts` に載せている記事の閲覧数の合計」（2026-10-28 オーナーと決定）。
- 価格は頻繁に変わるので持たない・出さない（2026-10-28 オーナー判断）。

## 注意

- **30件持つのは、ページ内で既に出している記事を除外したうえで6件残すため。**
  同じ記事が「読了後におすすめ」「関連記事」と重複しないよう、
  `getPopularPosts()` に除外リストを渡している（`src/lib/popular.ts`）。
- EC本体（`tokyoplants.com`）のページはCSVに混ざるので除外している。
  GA4プロパティにECが同居しているため。
- リストにある記事を削除・カテゴリ移動した場合、`getPopularPosts()` が
  黙って飛ばすのでビルドは壊れない。ただし表示件数が減るので、
  記事を整理したあとは更新しておくとよい。
- GA4 APIが使える環境なら、`mcp__analytics-mcp__run_report` で
  `pagePath` × `screenPageViews`（`hostName` = `media.tokyoplants.com` で絞る）を
  取れば、タイトル突合なしで直接 slug が得られる。
