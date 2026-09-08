import { CHARACTERS, NOTE_TYPE_LABELS, isCharacterId, isNoteType } from "@/lib/characterNotes";

interface Props {
  character: string;
  type: string;
  html: string;
}

/**
 * 記事本文中に挿入する、Green Collectionキャラクターの吹き出しコメント。
 * キャラクターが実際に話しかけているような親しみやすさを出しつつ、
 * 本文の専門性・信頼感を損なわないよう、コメント自体は本文の言い換えにしない。
 */
export default function CharacterNote({ character, type, html }: Props) {
  if (!isCharacterId(character)) return null;
  const info = CHARACTERS[character];
  const noteType = isNoteType(type) ? type : "point";
  const typeLabel = NOTE_TYPE_LABELS[noteType];

  return (
    <div className="not-prose my-6 flex items-start gap-2.5">
      {/* Avatar */}
      <div
        className={`flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white ring-2 ${info.ringClass}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={info.image} alt={info.name} className="h-11 w-11 object-contain" loading="lazy" />
      </div>

      {/* Speech bubble */}
      <div
        className={`relative min-w-0 flex-1 rounded-2xl rounded-tl-sm px-4 pb-3.5 pt-3 ${info.bubbleBgClass}`}
      >
        <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
          <span className={`text-[13px] font-extrabold ${info.nameTextClass}`}>{info.name}</span>
          <span className="text-[11px] text-zinc-500">{info.roleLabel}</span>
          <span className="ml-auto rounded-full bg-white/70 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.1em] text-zinc-500">
            {typeLabel}
          </span>
        </div>
        <div
          className="mt-1.5 text-[16px] leading-[1.7] text-zinc-800 [&>p]:m-0 [&>p+p]:mt-2 [font-family:var(--font-yomogi)]"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  );
}
