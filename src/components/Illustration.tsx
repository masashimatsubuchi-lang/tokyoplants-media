/**
 * 記事用のSVG図解（2026-11-26 導入）。
 * ショップの商品ページの図（粒の比較・配合の帯）と同じトーンで、文章だけでは伝わりにくい
 * 「仕組み」「違い」「数値の幅」を1枚で見せる。写真ではなく模式図なので、数値は記事本文と同じものだけを使う。
 *
 * 記法: <!-- illust name="…" title="…" caption="…" --> 箇条書き <!-- /illust -->
 *   箇条書きは「|」で列に分ける。列の意味は図ごとに下のコメントのとおり。
 *
 * 図の一覧
 *   soil-grain     土の粒とすき間の比較（2〜3個）。列: ラベル | 説明 | fine/coarse/mixed | ours（任意）
 *   light-types    育成ライト4タイプの照らし方。列: タイプ名 | 説明 | bulb/clip/panel/bar
 *   light-distance 距離が2倍で明るさ約1/4。箇条書きなし。attrs: near="20cm" far="40cm"
 *   ppfd-scale     必要なPPFDの幅の比較。列: ラベル | 30-80（上限なしは 400-600+） | 補足（任意）
 *                  attrs: max="600" target="200-350" target-label="室内の目標"
 */
import type { ParsedBlock } from "@/lib/articleBlocks";

type IllustBlock = Extract<ParsedBlock, { kind: "illust" }>;

const C = {
  coco: "#8a6844",
  cocoL: "#a8845a",
  pumice: "#d6cdbb",
  pumiceL: "#e7e1d4",
  pore: "#b9ae98",
  bark: "#3f2f22",
  compost: "#5a4635",
  fine: ["#4a3a2c", "#5c4734", "#6b5440", "#3d3026"],
  bg: "#f8f5ef",
  green: "#22614c",
  blue: "#3f86c6",
  water: "#7fb6e3",
  light: "#f6d77a",
  pot: "#c9a27e",
  potD: "#b08a66",
  leaf: "#4f8a5b",
  leafD: "#3c7049",
  ink: "#3f3f46",
};

/* ---------- 共通の枠 ---------- */
function Frame({ block, children, legend }: { block: IllustBlock; children: React.ReactNode; legend?: React.ReactNode }) {
  return (
    <figure className="not-prose my-8 rounded-2xl bg-[#f3f0ea] px-4 py-5 sm:px-6">
      {block.title && <p className="mb-4 text-center text-[15px] font-bold text-zinc-800">{block.title}</p>}
      {children}
      {legend && <div className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-1 text-[12px] text-zinc-600">{legend}</div>}
      {block.caption && <figcaption className="mt-3 text-center text-[12px] leading-relaxed text-zinc-500">{block.caption}</figcaption>}
    </figure>
  );
}

/* 決定的な乱数（ビルドごとに図が変わらないように） */
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function UpArrow({ x, y1, y2 }: { x: number; y1: number; y2: number }) {
  const d = `M${x} ${y1} L${x} ${y2 + 2}`;
  const head = `M${x - 7} ${y2 + 9} L${x} ${y2} L${x + 7} ${y2 + 9}`;
  return (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} stroke="#fff" strokeWidth={8} />
      <path d={head} stroke="#fff" strokeWidth={8} />
      <path d={d} stroke={C.blue} strokeWidth={3.5} />
      <path d={head} stroke={C.blue} strokeWidth={3.5} />
    </g>
  );
}

/* ---------- soil-grain ---------- */
type Grain = { x: number; y: number; r: number; rx: number; ry: number; rot: number; fill: string; kind: "chip" | "stone" | "bark" };

function placeGrains(seed: number, count: number, rMin: number, rMax: number, gap: number, kinds: Grain["kind"][]): Grain[] {
  const rand = rng(seed);
  const out: Grain[] = [];
  for (let i = 0; i < 3000 && out.length < count; i++) {
    const r = rMin + rand() * (rMax - rMin);
    const x = 6 + rand() * 188;
    const y = 6 + rand() * 188;
    if (Math.hypot(x - 100, y - 100) > 96 + r * 0.4) continue;
    if (out.some((g) => Math.hypot(g.x - x, g.y - y) < g.r + r + gap)) continue;
    const kind = kinds[Math.floor(rand() * kinds.length)];
    const fill =
      kind === "stone" ? (rand() < 0.5 ? C.pumice : C.pumiceL) : kind === "bark" ? C.bark : rand() < 0.5 ? C.coco : C.cocoL;
    const squash = kind === "chip" || kind === "bark" ? 0.55 + rand() * 0.25 : 0.85 + rand() * 0.15;
    out.push({ x, y, r, rx: r, ry: r * squash, rot: rand() * 180, fill, kind });
  }
  return out;
}

function SoilCircle({ type, ours, seed }: { type: string; ours: boolean; seed: number }) {
  const id = `soil-${type}-${seed}`;
  const rand = rng(seed + 7);
  let body: React.ReactNode = null;
  let bg = C.bg;
  if (type === "fine") {
    bg = "#4f3e30";
    const dots: React.ReactNode[] = [];
    let k = 0;
    for (let y = 2; y < 200; y += 9.5) {
      const off = (Math.round(y / 9.5) % 2) * 5;
      for (let x = 2 + off; x < 200; x += 10) {
        dots.push(<circle key={k++} cx={x + (rand() - 0.5) * 2} cy={y + (rand() - 0.5) * 2} r={6.2 + rand() * 1.4} fill={C.fine[Math.floor(rand() * 4)]} />);
      }
    }
    // 詰まった土にとどまる水
    const drops = [
      [62, 70], [120, 58], [92, 112], [148, 120], [56, 140], [112, 158], [140, 82],
    ].map(([x, y], i) => <circle key={`w${i}`} cx={x} cy={y} r={4.6} fill={C.water} stroke="#fff" strokeWidth={1} />);
    body = (
      <>
        {dots}
        {drops}
      </>
    );
  } else {
    const isMixed = type === "mixed";
    const grains = isMixed
      ? placeGrains(seed, 40, 10, 17, 3.5, ["chip", "stone", "bark", "chip", "stone"])
      : placeGrains(seed, 40, 12, 19, 3.5, ["chip", "stone"]);
    const small: React.ReactNode[] = [];
    const drops: React.ReactNode[] = [];
    if (isMixed) {
      // すき間の一部を埋める細かい有機質（ミミズ堆肥・ピートモス）と、それが抱える水
      const r2 = rng(seed + 99);
      let n = 0;
      for (let i = 0; i < 2000 && n < 22; i++) {
        const x = 8 + r2() * 184;
        const y = 8 + r2() * 184;
        const r = 2.4 + r2() * 1.6;
        if (Math.hypot(x - 100, y - 100) > 92) continue;
        if (grains.some((g) => Math.hypot(g.x - x, g.y - y) < g.r + r + 1)) continue;
        small.push(<circle key={`s${n}`} cx={x} cy={y} r={r} fill={C.compost} />);
        n++;
      }
      grains.slice(0, 7).forEach((g, i) => {
        const a = (i * 1.9) % (Math.PI * 2);
        drops.push(
          <circle key={`d${i}`} cx={g.x + Math.cos(a) * (g.r + 1)} cy={g.y + Math.sin(a) * (g.r + 1)} r={4.6} fill={C.water} stroke="#fff" strokeWidth={1} />,
        );
      });
    }
    body = (
      <>
        {grains.map((g, i) => (
          <g key={i}>
            <ellipse cx={g.x} cy={g.y} rx={g.rx} ry={g.ry} transform={`rotate(${g.rot} ${g.x} ${g.y})`} fill={g.fill} />
            {g.kind === "stone" && (
              <>
                <circle cx={g.x - g.r * 0.3} cy={g.y - g.r * 0.2} r={g.r * 0.12} fill={C.pore} />
                <circle cx={g.x + g.r * 0.25} cy={g.y + g.r * 0.3} r={g.r * 0.09} fill={C.pore} />
              </>
            )}
          </g>
        ))}
        {small}
        {drops}
        {isMixed ? (
          <>
            <UpArrow x={78} y1={176} y2={118} />
            <UpArrow x={126} y1={150} y2={92} />
          </>
        ) : (
          <>
            <UpArrow x={56} y1={168} y2={110} />
            <UpArrow x={100} y1={186} y2={112} />
            <UpArrow x={144} y1={168} y2={110} />
          </>
        )}
      </>
    );
  }
  return (
    <svg viewBox="0 0 200 200" className="mx-auto block w-full max-w-[150px]" aria-hidden="true">
      <defs>
        <clipPath id={id}>
          <circle cx={100} cy={100} r={94} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id})`}>
        <rect width={200} height={200} fill={bg} />
        {body}
      </g>
      <circle cx={100} cy={100} r={94} fill="none" stroke={ours ? C.green : "#cfc7b8"} strokeWidth={ours ? 4 : 2.5} />
    </svg>
  );
}

function SoilGrain({ block }: { block: IllustBlock }) {
  const rows = block.rows.filter((r) => r[0]);
  const hasWater = rows.some((r) => r[2] === "fine" || r[2] === "mixed");
  const cols = rows.length >= 3 ? "grid-cols-3" : "grid-cols-2";
  return (
    <Frame
      block={block}
      legend={
        <>
          <span className="inline-flex items-center gap-1.5">
            <span className="font-bold text-[#3f86c6]">↑</span>空気と水の通り道
          </span>
          {hasWater && (
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#7fb6e3]" />
              土にとどまる水分
            </span>
          )}
        </>
      }
    >
      <div className={`grid ${cols} gap-3 sm:gap-6`}>
        {rows.map((r, i) => {
          const ours = r[3] === "ours";
          return (
            <div key={i} className="text-center">
              <SoilCircle type={r[2] || "fine"} ours={ours} seed={11 + i * 31} />
              <p className={`mt-2 text-[13px] font-bold leading-snug ${ours ? "text-[#22614c]" : "text-zinc-700"}`}>{r[0]}</p>
              {r[1] && <p className={`mt-0.5 text-[12px] leading-snug ${ours ? "text-[#22614c]" : "text-zinc-500"}`}>{r[1]}</p>}
            </div>
          );
        })}
      </div>
    </Frame>
  );
}

/* ---------- light-types ---------- */
function Pot({ x, w, y = 100 }: { x: number; w: number; y?: number }) {
  const top = y - w * 0.7;
  return (
    <g>
      <ellipse cx={x - w * 0.22} cy={top - w * 0.32} rx={w * 0.3} ry={w * 0.16} transform={`rotate(-35 ${x - w * 0.22} ${top - w * 0.32})`} fill={C.leaf} />
      <ellipse cx={x + w * 0.24} cy={top - w * 0.36} rx={w * 0.32} ry={w * 0.16} transform={`rotate(30 ${x + w * 0.24} ${top - w * 0.36})`} fill={C.leafD} />
      <ellipse cx={x} cy={top - w * 0.55} rx={w * 0.16} ry={w * 0.3} fill={C.leaf} />
      <path d={`M${x - w / 2} ${top} L${x + w / 2} ${top} L${x + w * 0.38} ${y} L${x - w * 0.38} ${y} Z`} fill={C.pot} />
      <rect x={x - w / 2 - 1} y={top - 3} width={w + 2} height={5} rx={1.5} fill={C.potD} />
    </g>
  );
}

function LightIcon({ kind }: { kind: string }) {
  const ground = <line x1={4} y1={100.5} x2={116} y2={100.5} stroke="#d4cdc0" strokeWidth={1.5} />;
  switch (kind) {
    case "bulb":
      return (
        <>
          <path d="M60 28 L68 28 L86 82 L42 82 Z" fill={C.light} opacity={0.6} />
          {ground}
          <rect x={16} y={96} width={18} height={4} rx={1.5} fill="#6b6b6b" />
          <path d="M25 96 L25 16 Q25 10 31 10 L56 10" fill="none" stroke="#6b6b6b" strokeWidth={3} strokeLinecap="round" />
          <path d="M52 14 Q64 6 76 14 L72 26 L56 26 Z" fill="#555" />
          <ellipse cx={64} cy={28} rx={6} ry={3} fill="#fff6cf" />
          <Pot x={64} w={30} />
        </>
      );
    case "clip":
      return (
        <>
          <path d="M70 40 L80 40 L92 74 L58 74 Z" fill={C.light} opacity={0.6} />
          {ground}
          <Pot x={60} w={32} />
          <path d="M44 78 Q40 52 56 40 Q64 34 72 36" fill="none" stroke="#6b6b6b" strokeWidth={2.5} strokeLinecap="round" />
          <rect x={40} y={74} width={8} height={9} rx={2} fill="#555" />
          <path d="M68 32 L82 32 L80 40 L70 40 Z" fill="#555" />
        </>
      );
    case "panel":
      return (
        <>
          <path d="M12 22 L108 22 L116 80 L4 80 Z" fill={C.light} opacity={0.5} />
          {ground}
          <line x1={22} y1={2} x2={22} y2={15} stroke="#888" strokeWidth={1.2} />
          <line x1={98} y1={2} x2={98} y2={15} stroke="#888" strokeWidth={1.2} />
          <rect x={12} y={14} width={96} height={8} rx={2} fill="#555" />
          <Pot x={26} w={22} />
          <Pot x={60} w={22} />
          <Pot x={94} w={22} />
        </>
      );
    case "bar":
      return (
        <>
          <rect x={8} y={34} width={104} height={44} fill={C.light} opacity={0.45} />
          <rect x={4} y={24} width={112} height={5} rx={1} fill="#b8a991" />
          <line x1={6} y1={24} x2={6} y2={100} stroke="#b8a991" strokeWidth={3} />
          <line x1={114} y1={24} x2={114} y2={100} stroke="#b8a991" strokeWidth={3} />
          {ground}
          <rect x={12} y={30} width={46} height={4} rx={2} fill="#555" />
          <rect x={62} y={30} width={46} height={4} rx={2} fill="#555" />
          <Pot x={22} w={17} />
          <Pot x={47} w={17} />
          <Pot x={73} w={17} />
          <Pot x={98} w={17} />
        </>
      );
  }
  return null;
}

function LightTypes({ block }: { block: IllustBlock }) {
  const rows = block.rows.filter((r) => r[0]);
  return (
    <Frame block={block}>
      <div className="grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-4">
        {rows.map((r, i) => (
          <div key={i} className="text-center">
            <svg viewBox="0 0 120 104" className="mx-auto block w-full max-w-[150px] rounded-xl bg-white/70" aria-hidden="true">
              <LightIcon kind={r[2] ?? ""} />
            </svg>
            <p className="mt-2 text-[13px] font-bold text-zinc-800">{r[0]}</p>
            {r[1] && <p className="mt-0.5 text-[12px] leading-snug text-zinc-500">{r[1]}</p>}
          </div>
        ))}
      </div>
    </Frame>
  );
}

/* ---------- light-distance ---------- */
function LightDistance({ block }: { block: IllustBlock }) {
  const near = block.attrs.near || "20cm";
  const far = block.attrs.far || "40cm";
  const tile = 30;
  return (
    <Frame block={block}>
      <svg viewBox="0 0 330 200" className="mx-auto block w-full max-w-[460px]" role="img" aria-label={`光源から${near}と${far}の比較。距離が2倍になると、同じ光が約4倍の面積に広がり、1か所あたりの明るさは約4分の1になる`}>
        {/* 光の広がり */}
        <path d="M100 22 L118 22 L172 178 L46 178 Z" fill={C.light} opacity={0.45} />
        <path d="M102 22 Q109 8 116 22 Z" fill="#555" />
        <ellipse cx={109} cy={23} rx={8} ry={3} fill="#fff6cf" />
        {/* 近い面 */}
        <line x1={68} y1={100} x2={150} y2={100} stroke={C.ink} strokeWidth={2.5} strokeLinecap="round" />
        {/* 遠い面 */}
        <line x1={40} y1={178} x2={178} y2={178} stroke={C.ink} strokeWidth={2.5} strokeLinecap="round" />
        {/* 光源からの距離 */}
        <text x={62} y={104} fontSize={12} fill={C.ink} fontWeight={700} textAnchor="end">{near}</text>
        <text x={34} y={182} fontSize={12} fill={C.ink} fontWeight={700} textAnchor="end">{far}</text>
        <text x={124} y={16} fontSize={10.5} fill="#71717a">光源</text>
        {/* 面積と明るさ */}
        <g>
          <line x1={156} y1={100} x2={206} y2={86} stroke="#bbb" strokeDasharray="3 3" />
          <rect x={210} y={70} width={tile} height={tile} fill="#f0c53f" rx={2} />
          <text x={250} y={82} fontSize={12} fill={C.ink} fontWeight={700}>明るさ 1</text>
          <text x={250} y={97} fontSize={10.5} fill="#71717a">面積 1</text>
          <line x1={184} y1={178} x2={206} y2={166} stroke="#bbb" strokeDasharray="3 3" />
          {[0, 1].map((cx) =>
            [0, 1].map((cy) => (
              <rect key={`${cx}${cy}`} x={210 + cx * (tile + 2)} y={136 + cy * (tile + 2)} width={tile} height={tile} fill="#f0c53f" opacity={0.32} rx={2} />
            )),
          )}
          <text x={280} y={160} fontSize={12} fill={C.ink} fontWeight={700}>約1/4</text>
          <text x={280} y={175} fontSize={10.5} fill="#71717a">面積 4倍</text>
        </g>
      </svg>
    </Frame>
  );
}

/* ---------- ppfd-scale ---------- */
function parseRange(s: string): { min: number; max: number; open: boolean } | null {
  const open = /\+|以上/.test(s);
  const nums = s.replace(/,/g, "").match(/\d+(\.\d+)?/g)?.map(Number) ?? [];
  if (nums.length === 0) return null;
  return { min: nums[0], max: nums[1] ?? nums[0], open };
}

function PpfdScale({ block }: { block: IllustBlock }) {
  const max = Number(block.attrs.max) || 600;
  const ticks = Array.from({ length: Math.floor(max / 100) + 1 }, (_, i) => i * 100);
  const target = block.attrs.target ? parseRange(block.attrs.target) : null;
  const pct = (v: number) => `${Math.min(100, (v / max) * 100)}%`;
  const rows = block.rows.map((r) => ({ label: r[0], range: r[1] ?? "", note: r[2] ?? "", p: parseRange(r[1] ?? "") })).filter((r) => r.label && r.p);
  return (
    <Frame
      block={block}
      legend={
        target ? (
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-4 rounded-sm bg-[#22614c]/15 ring-1 ring-[#22614c]/30" />
            {block.attrs["target-label"] || "目標"}（{target.min}〜{target.max}）
          </span>
        ) : undefined
      }
    >
      <div className="space-y-2.5">
        {rows.map((r, i) => (
          <div key={i} className="grid grid-cols-[7.5rem_1fr] items-center gap-2 sm:grid-cols-[10rem_1fr]">
            <div className="leading-tight">
              <p className="text-[12.5px] font-bold text-zinc-800">{r.label}</p>
              <p className="text-[11px] text-zinc-500">
                {r.range.replace("-", "〜").replace("+", "以上")}
                {r.note && `・${r.note}`}
              </p>
            </div>
            <div className="relative h-5 rounded-full bg-white">
              {target && (
                <span className="absolute inset-y-[-4px] block bg-[#22614c]/10" style={{ left: pct(target.min), width: `calc(${pct(target.max)} - ${pct(target.min)})` }} />
              )}
              {/* .prose div[style] が幅を100%に固定するので、style付きの要素は span にする */}
              <span
                className="absolute inset-y-0 block rounded-full"
                style={{
                  left: pct(r.p!.min),
                  width: r.p!.open ? `calc(100% - ${pct(r.p!.min)})` : `calc(${pct(r.p!.max)} - ${pct(r.p!.min)})`,
                  minWidth: 8,
                  background: r.p!.open ? "linear-gradient(90deg,#3f8a5f,#3f8a5f 60%,rgba(63,138,95,0.15))" : "#3f8a5f",
                }}
              />
            </div>
          </div>
        ))}
        <div className="grid grid-cols-[7.5rem_1fr] gap-2 sm:grid-cols-[10rem_1fr]">
          <p className="text-right text-[10px] text-zinc-400">µmol/m²/s</p>
          <div className="relative h-4">
            {ticks.map((t) => (
              <span key={t} className="absolute -translate-x-1/2 text-[10px] text-zinc-400" style={{ left: pct(t) }}>
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Frame>
  );
}

export default function Illustration({ block }: { block: IllustBlock }) {
  switch (block.name) {
    case "soil-grain":
      return <SoilGrain block={block} />;
    case "light-types":
      return <LightTypes block={block} />;
    case "light-distance":
      return <LightDistance block={block} />;
    case "ppfd-scale":
      return <PpfdScale block={block} />;
  }
  return null;
}
