export interface FaqItem {
  question: string;
  answer: string;
}

/** remark-htmlが出力する数値文字参照・主要な名前付き実体をデコードする */
function decodeEntities(text: string): string {
  return text
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(parseInt(dec, 10)))
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

/** 記事本文のレンダリング済みHTML断片をプレーンテキストに変換する。
 * FAQPageのAnswer.textにマークアップを残さないための簡易変換。 */
function htmlToPlainText(html: string): string {
  return decodeEntities(
    html
      .replace(/<tr[^>]*>/gi, "\n")
      .replace(/<\/t[dh]>/gi, " | ")
      .replace(/<(p|li|br|h[1-6])[^>]*>/gi, "\n")
      .replace(/<[^>]+>/g, ""),
  )
    .replace(/[ \t]+/g, " ")
    .replace(/^\s*\|\s*/gm, "")
    .replace(/\s*\|\s*$/gm, "")
    .replace(/\n\s*\n+/g, "\n")
    .trim();
}

/** 指定した見出しパターンに一致する最初の h2 セクション（次の h2 の手前まで）を取り出す */
function extractSection(html: string, headingPattern: RegExp): string | null {
  const headings = [...html.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)];
  for (let i = 0; i < headings.length; i++) {
    const text = decodeEntities(headings[i][1].replace(/<[^>]+>/g, ""));
    if (headingPattern.test(text)) {
      const start = headings[i].index! + headings[i][0].length;
      const end = i + 1 < headings.length ? headings[i + 1].index! : html.length;
      return html.slice(start, end);
    }
  }
  return null;
}

/** 記事のFAQセクションからQ&Aを抽出する。
 * 対応パターン: `### Q. ...` 見出し形式、`**Q. ...**` / `A. ...` 段落形式の両方。
 * 一致するセクションが無い、または抽出できるQ&Aが無ければ空配列を返す。 */
export function extractFaqs(contentHtml: string): FaqItem[] {
  const section = extractSection(contentHtml, /よくある質問|FAQ|Q&A/i);
  if (!section) return [];

  const faqs: FaqItem[] = [];

  const h3Matches = [...section.matchAll(/<h3[^>]*>([\s\S]*?)<\/h3>/gi)];
  if (h3Matches.length > 0) {
    for (let i = 0; i < h3Matches.length; i++) {
      const qRaw = decodeEntities(h3Matches[i][1].replace(/<[^>]+>/g, "")).trim();
      const q = qRaw.replace(/^Q\.?\s*/i, "");
      const start = h3Matches[i].index! + h3Matches[i][0].length;
      const end = i + 1 < h3Matches.length ? h3Matches[i + 1].index! : section.length;
      const answer = htmlToPlainText(section.slice(start, end));
      if (q && answer) faqs.push({ question: q, answer });
    }
    return faqs;
  }

  const pMatches = [...section.matchAll(/<p>([\s\S]*?)<\/p>/gi)];
  for (const p of pMatches) {
    // 単一段落内に "**Q. ...**\nA. ..." が収まっているケース
    const combined = p[1].match(/^<strong>\s*Q\.?\s*([\s\S]*?)<\/strong>\s*(?:A\.?\s*)?([\s\S]*)$/i);
    if (combined) {
      const q = decodeEntities(combined[1].replace(/<[^>]+>/g, "")).trim();
      const answer = htmlToPlainText(combined[2]);
      if (q && answer) faqs.push({ question: q, answer });
      continue;
    }
  }
  if (faqs.length > 0) return faqs;

  // 質問と回答が別々の段落に分かれているケース
  for (let i = 0; i < pMatches.length; i++) {
    const qMatch = pMatches[i][1].match(/^<strong>\s*Q\.?\s*([\s\S]*?)<\/strong>\s*$/i);
    if (qMatch && i + 1 < pMatches.length) {
      const q = decodeEntities(qMatch[1].replace(/<[^>]+>/g, "")).trim();
      const aInner = pMatches[i + 1][1];
      const aMatch = aInner.match(/^A\.?\s*([\s\S]*)$/i);
      const answer = htmlToPlainText(aMatch ? aMatch[1] : aInner);
      if (q && answer) faqs.push({ question: q, answer });
    }
  }
  return faqs;
}
