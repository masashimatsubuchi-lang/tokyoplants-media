import { CHARACTERS, NOTE_TYPE_LABELS, isCharacterId, isNoteType } from "@/lib/characterNotes";

interface Props {
  character: string;
  type: string;
  html: string;
}

/**
 * 記事本文中に挿入する、Green Collectionキャラクターによる注釈カード。
 * 雑誌の「編集注（Editor's Note）」のような控えめな見せ方を意図しており、
 * 吹き出し会話のようなカジュアルな演出は避ける。
 *
 * 本文の専門性・信頼感を損なわないよう、装飾は最小限に留める。
 */
export default function CharacterNote({ character, type, html }: Props) {
  if (!isCharacterId(character)) return null;
  const info = CHARACTERS[character];
  const noteType = isNoteType(type) ? type : "point";
  const typeLabel = NOTE_TYPE_LABELS[noteType];

  return (
    <div
      className={`not-prose my-6 flex items-start gap-3 rounded-2xl border border-zinc-200 bg-zinc-50/70 py-3.5 pl-3.5 pr-4 border-l-4 ${info.accentBorderClass}`}
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white ring-1 ring-zinc-200">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={info.image} alt={info.name} className="h-9 w-9 object-contain" loading="lazy" />
      </div>
      <div className="min-w-0 flex-1 pt-0.5">
        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500">
          {`${info.englishName}'S ${typeLabel}`}
        </p>
        <div
          className="mt-1 text-[14px] leading-relaxed text-zinc-800 [&>p]:m-0 [&>p+p]:mt-2"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  );
}
