# Search Console API の接続手順

`scripts/gsc-queries.mjs` で検索クエリを直接取得するための初回セットアップ。
**オーナー作業は10分程度**。一度やれば以後は不要。

Googleの認証はオーナー本人の操作が必要なため、ここだけは代行できない。

---

## オーナーがやること

### 1. Google Cloud でプロジェクトを選ぶ

https://console.cloud.google.com/

GA4で既に使っているプロジェクトがあればそれでよい。無ければ新規作成（名前は何でもよい。例: `tokyoplants-media`）。

### 2. Search Console API を有効化する

https://console.cloud.google.com/apis/library/searchconsole.googleapis.com

上記を開いて「**有効にする**」。

### 3. サービスアカウントを作る

https://console.cloud.google.com/iam-admin/serviceaccounts

- 「**サービスアカウントを作成**」
- 名前: `gsc-reader`（何でもよい）
- **ロールは付けなくてよい**（Search Console側で権限を渡すため）。「続行」→「完了」

### 4. JSONキーを発行する

作ったサービスアカウントをクリック → 「**キー**」タブ → 「鍵を追加」→「新しい鍵を作成」→ **JSON** → 作成。

ファイルが自動でダウンロードされる。

### 5. キーを所定の場所に置く

ターミナルで以下を実行（ダウンロードしたファイル名に読み替える）。

```bash
mkdir -p ~/.config/tokyoplants && mv ~/Downloads/<ダウンロードしたファイル>.json ~/.config/tokyoplants/gsc-service-account.json && chmod 600 ~/.config/tokyoplants/gsc-service-account.json
```

> ⚠️ **このJSONは絶対にリポジトリに入れない。** 中に秘密鍵が入っており、コミットすると
> GitHub経由で流出する。だからホームディレクトリ配下に置いている。

### 6. Search Console にそのサービスアカウントを追加する

キーのJSONを開くと `"client_email": "gsc-reader@＜プロジェクト＞.iam.gserviceaccount.com"` という行がある。このメールアドレスをコピーする。

https://search.google.com/search-console → 左下の「**設定**」→「**ユーザーと権限**」→「**ユーザーを追加**」

- メールアドレス: 上記の `client_email`
- 権限: **制限付き**（閲覧のみ。フルは不要）

---

## 動作確認

```bash
node scripts/gsc-queries.mjs
```

直近28日のクエリ上位200件が出れば成功。

`403` が出る場合は **手順6の追加漏れ**。スクリプトがその旨を表示する。

---

## 使い方

```bash
node scripts/gsc-queries.mjs                   # 直近28日のクエリ上位200件
node scripts/gsc-queries.mjs --days 90 --limit 500
node scripts/gsc-queries.mjs --dim page        # ページ別
node scripts/gsc-queries.mjs --dim query,page  # クエリ×ページ（どの記事が何で拾っているか）
node scripts/gsc-queries.mjs --compare         # 前の同期間と比較（順位変動・クリック増減）
node scripts/gsc-queries.mjs --tsv out.tsv     # TSVに保存
```

`--compare` が施策の効果測定に使える。順位は小さいほど良いため、**改善をプラス表示**している
（`順位変動 +2.3` は 2.3位上がったという意味）。

## 注意

- GSCのデータは**2〜3日遅れる**。スクリプトは終端を3日前に置き、`dataState: final` で確定値のみを見る
- 対象プロパティは `https://media.tokyoplants.com/`（URLプレフィックス型）。
  変える場合は `GSC_SITE` 環境変数で指定する
- 1回のリクエストで取れるのは最大25,000行（APIの上限）
