/**
 * Amazon商品の価格を表示するかどうかの切り替え（2026-10-28 オーナー判断で非表示に）。
 *
 * 価格はAmazonで頻繁に変わり、記事に手で書いた値はすぐずれるため出さない。
 * ただし「購入数やクリック数が落ちるようなら戻せるように」との指示なので、
 * 記事の frontmatter（amazonProducts の price・note）のデータは消さずに残し、表示の段階で外している。
 *
 * 戻すときは SHOW_AMAZON_PRICES を true にするだけでよい（トップの人気ランキングは別。
 * あちらは価格のデータ自体を持っていない）。判断の基準値は永続メモリ
 * project_amazon_price_hidden_2026-10-28.md を参照。
 *
 * 効く場所: 記事内の amazon-cards（価格と説明文）、記事末尾のAmazon商品欄（説明文）、/items のAmazon商品（価格）。
 * 記事本文の地の文や表に書いた価格は対象外。
 */
export const SHOW_AMAZON_PRICES = false;

/** amazonProducts の price。非表示のときは undefined を返す */
export function amazonPrice(price: string | undefined): string | undefined {
  return SHOW_AMAZON_PRICES ? price : undefined;
}

/**
 * amazonProducts の note（説明文）から価格の部分だけを外す。
 * 説明文には「★4.2・レビュー1,235件・¥2,490（2026-10-17に確認）」のように評価と並べて価格を書いている。
 *   - 評価・レビュー件数と同じ文にある価格（「・¥2,490」など）は、その価格だけ外す
 *   - それ以外の価格の文（「1Lあたり約¥149。」「メーカー公式価格 ¥1,485（税込）」など）は、文ごと外す
 * 「1,000円台から試せる」のような大まかな価格帯は、すぐには古くならないので残す。
 */
export function amazonNote(note: string | undefined): string | undefined {
  if (!note || SHOW_AMAZON_PRICES || !note.includes("¥")) return note;
  let dropped = false;
  const stripped = note
    .replace(/。定期おトク便は¥[\d,]+/g, "")
    .split(/(?<=。)/)
    .map((sentence) => {
      // 直前の文を外したときは、それを受ける「ただし」も外す
      const s = dropped ? sentence.replace(/^ただし、?/, "") : sentence;
      dropped = false;
      if (!s.includes("¥")) return s;
      // 評価・レビュー件数と並べた文は、価格だけ外す
      if (/★|評価|件/.test(s)) return s.replace(/[・\s]?¥[\d,]+/g, "");
      // 価格が主役の文は、文ごと外す
      dropped = true;
      return "";
    })
    .join("")
    .trim();
  return stripped || undefined;
}

/**
 * 商品カードに出す説明文を「最初の一文」だけにする（2026-11-10 オーナー指示「注釈が多い。必要最低限に」）。
 *
 * frontmatter の note には、選定の記録として評価・レビュー件数・確認日・在庫・販売元まで書いてある。
 * これは監査用のデータなので消さずに残し、表示の段階で次のものを外す。
 *   - 括弧書きの確認メモ（「（2026-11-09にAmazon商品ページで確認／在庫あり・Prime対象）」など）
 *   - 評価・レビュー件数・在庫・販売元・価格だけの文
 * 残った文の先頭1文だけを返す。何も残らなければ undefined。
 */
export function amazonShortNote(note: string | undefined): string | undefined {
  if (!note) return undefined;
  const meta = /★|評価|レビュー|\d[\d,]*\s*件|在庫|Prime|出荷元|販売元|Amazon評価|20\d\d-\d\d|で確認|確認済|取得|¥|グローバルレーティング/;
  const cleaned = note
    // 確認メモの括弧書き
    .replace(/[（(][^）)]*(確認|取得|20\d\d|在庫|Prime|商品ページ)[^）)]*[）)]/g, "")
    // 「Amazon評価 4.2 / 619件・¥3,780」のような先頭の評価表記
    .replace(/Amazon評価\s*[\d.]+\s*\/\s*[\d,]+件[^。]*。?/g, "");
  const first = cleaned
    .split(/(?<=。)|\s\/\s|／/)
    .map((s) => s.trim())
    .find((s) => s && !meta.test(s));
  return first ? first.replace(/。$/, "") : undefined;
}

/** note に Prime 対象と記録されている商品か（「Prime対象外」は除く） */
export function amazonIsPrime(note: string | undefined): boolean {
  return !!note && /Prime(?!\s?Video)/.test(note) && !/Prime(対象)?外|Prime非対象/.test(note);
}
