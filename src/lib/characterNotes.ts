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
  /** 名前の横に表示する、担当領域の短い日本語ラベル */
  roleLabel: string;
  /** /public 配下の画像パス */
  image: string;
  /** 吹き出し・名前などに使うブランドアクセントカラー（背景タイント用、低opacityで使用） */
  accentHex: string;
  /** 名前テキスト用の、白背景でも読みやすいアクセントカラー（淡い色は手動で濃くした値） */
  nameTextClass: string;
  /** 吹き出し背景の淡いタイント用Tailwindクラス */
  bubbleBgClass: string;
  /** このキャラクターが担当するテーマ（記事執筆時の選定メモ、詳細版。UIには出さない） */
  topics: string;
  /** 一言でわかるキャラクター性（記事執筆時のトーン参考。UIには出さない） */
  personality: string;
}

export const CHARACTERS: Record<CharacterId, CharacterInfo> = {
  lum: {
    name: "ラム",
    roleLabel: "植物博士",
    image: "/characters/char_lum.png",
    accentHex: "#F3DFA8",
    nameTextClass: "text-[#8A6D23]",
    bubbleBgClass: "bg-[#F3DFA8]/20",
    topics: "植物の特徴・育て方・豆知識（品種の性質、なぜそうなるかの仕組み）",
    personality: "穏やかで物知りな植物博士。説教しない、短くわかりやすい説明が得意。",
  },
  shadee: {
    name: "シャディ",
    roleLabel: "水やり担当",
    image: "/characters/char_shadee.png",
    accentHex: "#2F5D4A",
    nameTextClass: "text-[#2F5D4A]",
    bubbleBgClass: "bg-[#2F5D4A]/10",
    topics: "水やり・乾燥・水分管理（頻度の目安、乾かし気味/多湿の判断）",
    personality: "控えめで観察力がある見守り役。押しつけがましくなく、寄り添うように促す。",
  },
  kuro: {
    name: "クロ",
    roleLabel: "土・植え替え担当",
    image: "/characters/char_kuro.png",
    accentHex: "#4A4038",
    nameTextClass: "text-[#4A4038]",
    bubbleBgClass: "bg-[#4A4038]/8",
    topics: "土・根・植え替え・用土配合",
    personality: "寡黙で頼れる職人気質。短く核心を突くひとことが多い。",
  },
  bloom: {
    name: "ブルーム",
    roleLabel: "成長・開花担当",
    image: "/characters/char_bloom.png",
    accentHex: "#FF9F5A",
    nameTextClass: "text-[#C2570A]",
    bubbleBgClass: "bg-[#FF9F5A]/15",
    topics: "成長・開花・生育・繁殖（増やし方、生育サイン）",
    personality: "明るいムードメーカー。前向きで少し大げさなくらい褒め上手。",
  },
  sandy: {
    name: "サンディ",
    roleLabel: "光・日照担当",
    image: "/characters/char_sundae.png",
    accentHex: "#FFD166",
    nameTextClass: "text-[#9C6B00]",
    bubbleBgClass: "bg-[#FFD166]/20",
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
