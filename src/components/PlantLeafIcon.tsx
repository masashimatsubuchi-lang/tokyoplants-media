type LeafKind = "monstera" | "philodendron" | "anthurium" | "alocasia" | "aglaonema" | "begonia";

function MonsteraLeaf() {
  return (
    <>
      <circle cx="50" cy="46" r="34" fill="#cfe0d4" opacity="0.5" />
      <path
        d="M50 14c-16 0-24 16-22 30-3 6-6 14-2 22 3 6 10 8 14 4 2 6 8 10 10 4 4 6 10 4 10-2 6 4 12 0 10-6 5 2 10-4 6-9 4-1 6-8 2-13 3-8 0-19-9-25-3-2-6-5-9-5z"
        fill="#7fa383"
      />
      <path
        d="M50 14c-16 0-24 16-22 30-3 6-6 14-2 22 3 6 10 8 14 4 2 6 8 10 10 4 4 6 10 4 10-2 6 4 12 0 10-6 5 2 10-4 6-9 4-1 6-8 2-13 3-8 0-19-9-25-3-2-6-5-9-5z"
        fill="none"
        stroke="#4e6f54"
        strokeWidth="0.6"
        opacity="0.4"
      />
      <ellipse cx="42" cy="34" rx="4" ry="7" fill="#f4f1e8" opacity="0.85" />
      <ellipse cx="60" cy="40" rx="3.5" ry="8" fill="#f4f1e8" opacity="0.85" />
      <ellipse cx="52" cy="60" rx="3" ry="6" fill="#f4f1e8" opacity="0.7" />
      <line x1="50" y1="82" x2="50" y2="52" stroke="#5c7f62" strokeWidth="2" strokeLinecap="round" />
    </>
  );
}

function PhilodendronLeaf() {
  return (
    <>
      <circle cx="52" cy="44" r="32" fill="#d8e6da" opacity="0.5" />
      <path
        d="M40 78 C22 62 20 38 38 24 C44 19 52 19 52 28 C52 19 60 19 66 24 C84 38 82 62 64 78 C58 83 46 83 40 78Z"
        fill="#658a6a"
      />
      <path
        d="M52 30 C52 46 52 62 52 78"
        stroke="#4b6b50"
        strokeWidth="1.2"
        opacity="0.5"
        fill="none"
      />
      <path
        d="M56 68 C40 54 38 34 54 22 C60 18 66 18 66 26 C66 18 72 18 76 23 C90 35 88 55 74 68 C68 72 60 72 56 68Z"
        fill="#8ba98d"
        opacity="0.75"
      />
      <line x1="52" y1="86" x2="52" y2="76" stroke="#4b6b50" strokeWidth="2" strokeLinecap="round" />
    </>
  );
}

function AnthuriumLeaf() {
  return (
    <>
      <circle cx="55" cy="42" r="30" fill="#d9e6da" opacity="0.5" />
      <path
        d="M50 20 C30 24 18 42 26 60 C32 74 48 80 58 74 C74 66 78 46 66 30 C62 24 56 20 50 20Z"
        fill="#77997b"
      />
      <path
        d="M50 24 C36 30 28 44 34 56"
        stroke="#f4f1e8"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
        opacity="0.9"
      />
      <ellipse cx="72" cy="50" rx="4.5" ry="14" fill="#e7c78f" opacity="0.9" />
      <line x1="72" y1="64" x2="72" y2="80" stroke="#a98a52" strokeWidth="2" strokeLinecap="round" />
      <line x1="46" y1="78" x2="46" y2="66" stroke="#4b6b50" strokeWidth="2" strokeLinecap="round" />
    </>
  );
}

function AlocasiaLeaf() {
  return (
    <>
      <circle cx="50" cy="48" r="32" fill="#d3e2d6" opacity="0.5" />
      <path
        d="M40 82 C34 62 34 40 44 24 C48 18 52 18 52 26 C52 44 48 64 44 82Z"
        fill="#6c9071"
        opacity="0.9"
      />
      <path
        d="M56 82 C50 58 52 34 64 18 C68 14 72 16 70 24 C64 42 60 62 62 82Z"
        fill="#8ba98d"
      />
      <line x1="43" y1="82" x2="47" y2="60" stroke="#4b6b50" strokeWidth="1" opacity="0.4" />
      <line x1="63" y1="82" x2="64" y2="56" stroke="#4b6b50" strokeWidth="1" opacity="0.4" />
    </>
  );
}

function AglaonemaLeaf() {
  return (
    <>
      <circle cx="50" cy="48" r="32" fill="#dbe7d6" opacity="0.5" />
      <path d="M50 82 C46 60 44 40 46 22 C47 16 53 16 54 22 C56 40 54 60 50 82Z" fill="#5c7f62" />
      <path
        d="M50 78 C40 62 32 46 30 34 C29 28 35 27 38 32 C46 44 49 60 50 78Z"
        fill="#7fa383"
        opacity="0.9"
      />
      <path
        d="M52 74 C60 58 68 44 72 32 C74 27 68 25 65 30 C58 42 54 58 52 74Z"
        fill="#9bb99c"
        opacity="0.85"
      />
    </>
  );
}

function BegoniaLeaf() {
  return (
    <>
      <circle cx="50" cy="48" r="32" fill="#d9e5da" opacity="0.5" />
      <path
        d="M52 20 C34 18 20 32 22 50 C24 68 40 80 56 76 C74 72 82 54 74 38 C68 26 60 20 52 20Z"
        fill="#4e6f54"
      />
      <circle cx="42" cy="38" r="3.5" fill="#f4f1e8" opacity="0.85" />
      <circle cx="56" cy="32" r="2.5" fill="#f4f1e8" opacity="0.8" />
      <circle cx="62" cy="48" r="4" fill="#f4f1e8" opacity="0.85" />
      <circle cx="48" cy="56" r="2.8" fill="#f4f1e8" opacity="0.75" />
      <circle cx="34" cy="52" r="2.2" fill="#f4f1e8" opacity="0.7" />
      <line x1="52" y1="80" x2="52" y2="72" stroke="#3c5641" strokeWidth="2" strokeLinecap="round" />
    </>
  );
}

const LEAF_RENDERERS: Record<LeafKind, () => React.ReactElement> = {
  monstera: MonsteraLeaf,
  philodendron: PhilodendronLeaf,
  anthurium: AnthuriumLeaf,
  alocasia: AlocasiaLeaf,
  aglaonema: AglaonemaLeaf,
  begonia: BegoniaLeaf,
};

export default function PlantLeafIcon({ kind, className }: { kind: LeafKind; className?: string }) {
  const Renderer = LEAF_RENDERERS[kind];
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <Renderer />
    </svg>
  );
}
