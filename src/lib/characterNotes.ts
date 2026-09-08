/**
 * Green Collection（観葉植物管理アプリ）のキャラクターを、tokyoplants media記事内の
 * 「キャラクター注釈（CharacterNote）」として登場させるための設定。
 *
 * ここに定義された5キャラクターのみをメディアに登場させる（アプリ本体には他に3体いるが、
 * メディアでは混乱を避けるため対象外）。
 *
 * 記事本文（Markdown）からは、以下のHTMLコメント記法で呼び出す:
 *
 *   <!-- character-note character="lum" type="point" -->
 *   本文を補足する1〜3文のコメント。
 *   <!-- /character-note -->
 *
 * character には下記オブジェクトのキー（lum/shadee/kuro/bloom/sandy）、
 * type には point/tip/warning のいずれかを指定する。
 */

export type CharacterId = "lum" | "shadee" | "kuro" | "bloom" | "sandy";
export type NoteType = "point" | "tip" | "warning";

export interface CharacterInfo {
  /** メディア表記の日本語名 */
  name: string;
  /** ラベル表示用の英語名（例: "LUM'S POINT"） */
  englishName: string;
  /** /public 配下の画像パス */
  image: string;
  /** カード左ボーダー用のTailwindクラス（ブランドアクセントカラー） */
  accentBorderClass: string;
  /** このキャラクターが担当するテーマ（記事執筆時の選定メモ。UIには出さない） */
  topics: string;
  /** 一言でわかるキャラクター性（記事執筆時のトーン参考。UIには出さない） */
  personality: string;
}

export const CHARACTERS: Record<CharacterId, CharacterInfo> = {
  lum: {
    name: "ラム",
    englishName: "LUM",
    image: "/characters/char_lum.png",
    accentBorderClass: "border-l-[#F3DFA8]",
    topics: "植物の特徴・育て方・豆知識（品種の性質、なぜそうなるかの仕組み）",
    personality: "穏やかで物知りな植物博士。説教しない、短くわかりやすい説明が得意。",
  },
  shadee: {
    name: "シャディ",
    englishName: "SHADEE",
    image: "/characters/char_shadee.png",
    accentBorderClass: "border-l-[#2F5D4A]",
    topics: "水やり・乾燥・水分管理（頻度の目安、乾かし気味/多湿の判断）",
    personality: "控えめで観察力がある見守り役。押しつけがましくなく、寄り添うように促す。",
  },
  kuro: {
    name: "クロ",
    englishName: "KURO",
    image: "/characters/char_kuro.png",
    accentBorderClass: "border-l-[#4A4038]",
    topics: "土・根・植え替え・用土配合",
    personality: "寡黙で頼れる職人気質。短く核心を突くひとことが多い。",
  },
  bloom: {
    name: "ブルーム",
    englishName: "BLOOM",
    image: "/characters/char_bloom.png",
    accentBorderClass: "border-l-[#FF9F5A]",
    topics: "成長・開花・生育・繁殖（増やし方、生育サイン）",
    personality: "明るいムードメーカー。前向きで少し大げさなくらい褒め上手。",
  },
  sandy: {
    name: "サンディ",
    englishName: "SANDY",
    image: "/characters/char_sundae.png",
    accentBorderClass: "border-l-[#FFD166]",
    topics: "光・日照・育成ライト・置き場所",
    personality: "のんびり屋で太陽好き。ほどよい塩梅を教えてくれる。",
  },
};

export const NOTE_TYPE_LABELS: Record<NoteType, string> = {
  point: "POINT",
  tip: "TIP",
  warning: "WARNING",
};

export const CHARACTER_IDS = Object.keys(CHARACTERS) as CharacterId[];
export const NOTE_TYPES = Object.keys(NOTE_TYPE_LABELS) as NoteType[];

export function isCharacterId(value: string): value is CharacterId {
  return (CHARACTER_IDS as string[]).includes(value);
}

export function isNoteType(value: string): value is NoteType {
  return (NOTE_TYPES as string[]).includes(value);
}
