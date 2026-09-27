# 「よく読まれている記事」データの更新手順

記事末尾の `PostScroller`（`eyebrow="Popular"`）が使うランキングは、
`src/data/popular-articles.json` の静的リストです。GA4はビルド時に叩けないため、
エクスポートから手作業で作り直します。**月1回を目安に更新してください。**

## 手順

1. GA4（プロパティ「tokyoplants｜media」／ID `525020490`）の
   「レポートのスナップショット」をCSVでエクスポートする。
   期間は直近28日程度。ダウンロードフォルダに保存される。
2. 下のスクリプトを `python3 -` に流し込む（`SRC` を落としたCSVのパスに直す）。
3. 差分を確認して `src/data/popular-articles.json` をコミットする。

```python
import csv, pathlib, re, json
SRC = pathlib.Path("/Users/masashimatsubuchi/Downloads/レポートのスナップショット (4).csv")
PERIOD = {"start": "2026-08-29", "end": "2026-09-25"}   # CSVヘッダの開始日・終了日に合わせる
GENERATED = "2026-09-27"

lines = SRC.read_text(encoding="utf-8").split("\n")
start = next(i for i, l in enumerate(lines) if l.startswith("ページ タイトルとスクリーン クラス"))
rows = []
for l in lines[start + 1:]:
    if not l.strip() or l.startswith("#"):
        break
    r = next(csv.reader([l]))
    if len(r) < 2:
        break
    try:
        rows.append((r[0], int(r[1])))
    except ValueError:
        break

# frontmatter の title から slug を引く辞書。タイトルを変えた記事も拾えるよう、
# 「｜」より前の見出し部分でも引けるようにしておく。
title2slug, head2slug = {}, {}
for f in pathlib.Path("content").rglob("*.md"):
    t = f.read_text(encoding="utf-8")
    m = re.search(r'^title:\s*"(.*?)"\s*$', t, re.M) or re.search(r"^title:\s*'(.*?)'\s*$", t, re.M)
    if not m:
        continue
    slug = f"{f.parent.name}/{f.stem}"
    title = m.group(1).strip()
    title2slug[title] = slug
    head2slug.setdefault(re.split(r"[｜|]", title)[0].strip(), slug)

seen, out = set(), []
for title, views in rows:
    t = re.sub(r"\s*\|\s*tokyoplants media\s*$", "", title).strip()
    if "tokyoplants (トーキョープランツ)" in title:   # EC本体のページは対象外
        continue
    slug = title2slug.get(t) or head2slug.get(re.split(r"[｜|]", t)[0].strip())
    if not slug or slug in seen or not pathlib.Path(f"content/{slug}.md").exists():
        continue
    seen.add(slug)
    out.append({"slug": slug, "views": views})

data = {
    "_note": "GA4「tokyoplants｜media」プロパティの表示回数から作成した人気記事リスト。記事末尾の『よく読まれている記事』で使う。更新手順は scripts/README-popular-articles.md を参照。",
    "period": PERIOD,
    "generatedAt": GENERATED,
    "items": out[:30],
}
pathlib.Path("src/data/popular-articles.json").write_text(
    json.dumps(data, ensure_ascii=False, indent=2) + "\n"
)
print(f"{len(data['items'])}件を書き出しました")
```

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
