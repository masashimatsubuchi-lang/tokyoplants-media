/**
 * Daily Botanical Towel の柄（全8種）と、記事に合う柄を選ぶ処理。
 *
 * 2026-11-10 オーナー指示：タオルは8種類の柄があるので、アロカシアの記事ならアロカシアのタオルを出す。
 * 並びはECの「種類」の8項目と同じ。トップページ（homeStorefront.ts）もここを参照する。
 * 色は商品写真の地の色から取った目安で、2色の柄は丸を斜めに塗り分ける。
 */
export type TowelPattern = { name: string; file: string; color: string };

export const TOWEL_PATTERNS: TowelPattern[] = [
  { name: "モンステラ・デリシオーサ｜斑入り", file: "monstera-variegata", color: "linear-gradient(135deg, #2f6b4f 50%, #efe6c2 50%)" },
  { name: "モンステラ・デリシオーサ｜緑", file: "monstera-green", color: "linear-gradient(135deg, #3a6e4a 50%, #ffffff 50%)" },
  { name: "アンスリウム・ワロクアーナム｜緑", file: "warocqueanum-green", color: "#6fa35f" },
  { name: "アンスリウム・ワロクアーナム｜深緑", file: "warocqueanum-deepgreen", color: "#2c5a38" },
  { name: "アンスリウム・キング オブ スペード｜緑", file: "king-of-spades-green", color: "#3f7d64" },
  { name: "アンスリウム・キング オブ スペード｜黒", file: "king-of-spades-black", color: "#1f2e52" },
  { name: "アロカシア｜緑", file: "alocasia-green", color: "linear-gradient(135deg, #b8dba4 50%, #2f6a3d 50%)" },
  { name: "アロカシア｜ピンク", file: "alocasia-pink", color: "linear-gradient(135deg, #f5d2d9 50%, #5cc24e 50%)" },
];

export const TOWEL_ITEM_PATH = "/items/135803882";

export function towelImage(file: string, small = true): string {
  return `/images/home/towel-${file}${small ? "-560" : ""}.jpg`;
}

const byFile = (file: string) => TOWEL_PATTERNS.find((p) => p.file === file)!;

export type TowelChoice = { mode: "pattern"; pattern: TowelPattern; genus: string } | { mode: "lineup" };

/**
 * 記事に出すタオルを決める。対象外なら null。
 * - モンステラ・アンスリウム・アロカシアの記事 → その植物の柄（タオルのモチーフと一致する記事だけ。掲載ルールどおり）
 * - ギフト・プレゼントの記事 → 全8種の一覧
 * それ以外の記事には出さない（土の導線を弱めないため）。
 */
export function pickTowel(slug: string, title: string, tags: string[] = []): TowelChoice | null {
  const s = `${slug} ${title}`.toLowerCase();
  if (/monstera|モンステラ/.test(s)) {
    const variegated = /albo|variegat|thai|mint|marilyn|aurea|斑入り|タイコン/.test(s);
    return { mode: "pattern", genus: "モンステラ", pattern: byFile(variegated ? "monstera-variegata" : "monstera-green") };
  }
  if (/anthurium|アンスリウム/.test(s)) {
    if (/warocqueanum|ワロクア|veitchii|wendlingeri|vittarifolium/.test(s)) return { mode: "pattern", genus: "アンスリウム", pattern: byFile("warocqueanum-green") };
    if (/king|キング|hybrid-names|交配/.test(s)) return { mode: "pattern", genus: "アンスリウム", pattern: byFile("king-of-spades-black") };
    if (/crystallinum|clarinervium|papillilaminum|magnificum|forgetii|carlablackiae|regale|velvet|ビロード|luxurians|hookeri|moodeanum|kunayal/.test(s))
      return { mode: "pattern", genus: "アンスリウム", pattern: byFile("king-of-spades-green") };
    return { mode: "pattern", genus: "アンスリウム", pattern: byFile("warocqueanum-deepgreen") };
  }
  if (/alocasia|アロカシア/.test(s)) {
    return { mode: "pattern", genus: "アロカシア", pattern: byFile(/pink|ピンク/.test(s) ? "alocasia-pink" : "alocasia-green") };
  }
  if (/gift|present/.test(slug) || tags.some((t) => /ギフト|プレゼント|贈り物/.test(t))) return { mode: "lineup" };
  return null;
}
