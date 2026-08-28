export interface HowToStep {
  name: string;
  text: string;
}

export interface HowToData {
  name: string;
  steps: HowToStep[];
}

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

const STEP_HEADING = /^(?:ステップ|STEP)\s*[0-9０-９]+/i;

/** 記事本文から「### ステップ1」「### STEP 1」形式の連続する手順見出しを検出し、
 * HowTo構造化データ用のステップ一覧に変換する。該当しなければ null を返す。 */
export function extractHowTo(contentHtml: string): HowToData | null {
  const h2Matches = [...contentHtml.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)];
  const h3Matches = [...contentHtml.matchAll(/<h3[^>]*>([\s\S]*?)<\/h3>/gi)];

  const firstStepIdx = h3Matches.findIndex((m) =>
    STEP_HEADING.test(decodeEntities(m[1].replace(/<[^>]+>/g, "")).trim()),
  );
  if (firstStepIdx === -1) return null;

  // 連続する「ステップN」見出しだけを手順として採用する
  const stepHeadings: RegExpMatchArray[] = [];
  for (let i = firstStepIdx; i < h3Matches.length; i++) {
    const text = decodeEntities(h3Matches[i][1].replace(/<[^>]+>/g, "")).trim();
    if (!STEP_HEADING.test(text)) break;
    stepHeadings.push(h3Matches[i]);
  }
  if (stepHeadings.length < 2) return null;

  const nextH2AfterSteps = h2Matches.find((m) => m.index! > stepHeadings[0].index!);
  const stepsEnd = nextH2AfterSteps ? nextH2AfterSteps.index! : contentHtml.length;

  const steps: HowToStep[] = stepHeadings.map((h, i) => {
    const rawTitle = decodeEntities(h[1].replace(/<[^>]+>/g, "")).trim();
    const name = rawTitle.replace(/^(?:ステップ|STEP)\s*[0-9０-９]+\s*[:：.．｜\-—]?\s*/i, "") || rawTitle;
    const start = h.index! + h[0].length;
    const end = i + 1 < stepHeadings.length ? stepHeadings[i + 1].index! : stepsEnd;
    const text = htmlToPlainText(contentHtml.slice(start, end));
    return { name, text };
  });
  if (steps.some((s) => !s.text)) return null;

  // 直前の h2 見出しをHowTo全体の名前として使う
  const firstStepPos = stepHeadings[0].index!;
  const precedingH2 = [...h2Matches].reverse().find((m) => m.index! < firstStepPos);
  const name = precedingH2
    ? decodeEntities(precedingH2[1].replace(/<[^>]+>/g, "")).trim()
    : "手順";

  return { name, steps };
}
