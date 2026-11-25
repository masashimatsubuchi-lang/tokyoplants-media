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
 *   ppfd-scale     必要なPPFDの幅の比較（range の単位をPPFDにしたもの）
 *   range          数値の幅（温度・湿度など）。列: ラベル | 30-80 / 400-600+ / -5-10 / 5（1点） | 補足（任意）
 *                  attrs: unit="℃" min max step target="200-350" target-label color="green|blue|amber|red"
 *   flow           原因→結果・手順の流れ。列: 見出し | 説明。attrs: tone="warning|good"
 *   pot-section    鉢の断面。列（上の層から）: 名前 | 説明 | soil/stone/hydro/bark/mulch/water | 厚さの比。attrs: hole="false"
 *   roots          根の状態。列: ラベル | 説明 | healthy/rotten/bound/dry
 *   room-zones     部屋の置き場所。列: 名前 | 説明 | window/good/heater/floor/high
 *   leaf-check     葉の症状。列: 症状 | 原因 | healthy/yellow/brown-tip/spots/droop/curl/pale/burn/black
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

/* ---------- range（ppfd-scale） ----------
 * 数値の幅を横棒で並べる。温度・湿度・PPFD など単位は attrs.unit。
 * 列: ラベル | 値 | 補足（任意）
 *   値は「150-300」「400-600+」「-5-10」「5」（1点は丸印）。「以上」「+」で右端まで伸ばす
 * attrs: unit / min / max / step / target="200-350" / target-label / color="green|blue|amber|red"
 */
type Range = { min: number; max: number; open: boolean; point: boolean };
function parseRange(s: string): Range | null {
  const t = s.replace(/,/g, "").replace(/[℃%]/g, "").trim();
  const m = t.match(/^(-?\d+(?:\.\d+)?)(?:\s*[-〜~]\s*(-?\d+(?:\.\d+)?))?\s*(\+|以上)?/);
  if (!m) return null;
  const a = Number(m[1]);
  const b = m[2] !== undefined ? Number(m[2]) : a;
  return { min: Math.min(a, b), max: Math.max(a, b), open: !!m[3], point: m[2] === undefined && !m[3] };
}
const RANGE_COLORS: Record<string, string> = { green: "#3f8a5f", blue: "#3f7fb8", amber: "#c98a2b", red: "#c0573f" };

function niceStep(span: number) {
  const raw = span / 5;
  const pow = Math.pow(10, Math.floor(Math.log10(raw)));
  const n = raw / pow;
  return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10) * pow;
}

function RangeBars({ block, defaultUnit = "" }: { block: IllustBlock; defaultUnit?: string }) {
  const unit = block.attrs.unit ?? defaultUnit;
  const rows = block.rows.map((r) => ({ label: r[0], value: r[1] ?? "", note: r[2] ?? "", p: parseRange(r[1] ?? "") })).filter((r) => r.label && r.p);
  const lo = block.attrs.min !== undefined ? Number(block.attrs.min) : Math.min(0, ...rows.map((r) => r.p!.min));
  const hi = Number(block.attrs.max) || Math.max(...rows.map((r) => r.p!.max)) * 1.1;
  const step = Number(block.attrs.step) || niceStep(hi - lo);
  const ticks: number[] = [];
  for (let t = Math.ceil(lo / step) * step; t <= hi + 1e-9; t += step) ticks.push(Math.round(t * 100) / 100);
  const target = block.attrs.target ? parseRange(block.attrs.target) : null;
  const color = RANGE_COLORS[block.attrs.color ?? "green"] ?? RANGE_COLORS.green;
  const pos = (v: number) => Math.max(0, Math.min(100, ((v - lo) / (hi - lo)) * 100));
  const pct = (v: number) => `${pos(v)}%`;
  const fmt = (r: (typeof rows)[number]) => {
    const p = r.p!;
    if (p.point) return `${p.min}${unit === "℃" || unit === "%" ? unit : ""}`;
    const u = unit === "℃" || unit === "%" ? unit : "";
    return p.open ? `${p.min}${u}以上` : `${p.min}〜${p.max}${u}`;
  };
  return (
    <Frame
      block={block}
      legend={
        target ? (
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-4 rounded-sm bg-[#22614c]/15 ring-1 ring-[#22614c]/30" />
            {block.attrs["target-label"] || "目標"}（{target.min}〜{target.max}
            {unit === "℃" || unit === "%" ? unit : ""}）
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
                {fmt(r)}
                {r.note && `・${r.note}`}
              </p>
            </div>
            <div className="relative h-5 rounded-full bg-white">
              {/* .prose div[style] が幅を100%に固定するので、style付きの要素は span にする */}
              {target && (
                <span className="absolute inset-y-[-4px] block bg-[#22614c]/10" style={{ left: pct(target.min), width: `${pos(target.max) - pos(target.min)}%` }} />
              )}
              {r.p!.point ? (
                <span className="absolute top-1/2 block h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-white" style={{ left: pct(r.p!.min), background: color }} />
              ) : (
                <span
                  className="absolute inset-y-0 block rounded-full"
                  style={{
                    left: pct(r.p!.min),
                    width: r.p!.open ? `${100 - pos(r.p!.min)}%` : `${pos(r.p!.max) - pos(r.p!.min)}%`,
                    minWidth: 8,
                    background: r.p!.open ? `linear-gradient(90deg,${color},${color} 60%,${color}26)` : color,
                  }}
                />
              )}
            </div>
          </div>
        ))}
        <div className="grid grid-cols-[7.5rem_1fr] gap-2 sm:grid-cols-[10rem_1fr]">
          <p className="text-right text-[10px] text-zinc-400">{unit}</p>
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

/* ---------- flow ----------
 * 原因→結果、手順の流れを矢印でつなぐ。列: 見出し | 説明（任意）
 * attrs: tone="warning|good|neutral"（最後の箱の色）
 */
function Flow({ block }: { block: IllustBlock }) {
  const rows = block.rows.filter((r) => r[0]);
  const tone = block.attrs.tone ?? "neutral";
  const last =
    tone === "warning" ? "border-[#c0573f] bg-[#fbeee9] text-[#8f3a26]" : tone === "good" ? "border-[#22614c] bg-[#e9f3ee] text-[#1b4d3c]" : "border-zinc-400 bg-white text-zinc-800";
  const horizontal = rows.length <= 4;
  return (
    <Frame block={block}>
      <ol className={`flex flex-col items-stretch gap-0 ${horizontal ? "sm:flex-row sm:items-stretch" : ""}`}>
        {rows.map((r, i) => {
          const isLast = i === rows.length - 1;
          return (
            <li key={i} className={`flex flex-col items-center ${horizontal ? "sm:flex-1 sm:flex-row" : ""}`}>
              <div className={`w-full rounded-xl border-2 px-3 py-2.5 text-center ${isLast ? last : "border-transparent bg-white text-zinc-800"}`}>
                <p className="text-[13.5px] font-bold leading-snug">{r[0]}</p>
                {r[1] && <p className="mt-0.5 text-[12px] leading-snug opacity-80">{r[1]}</p>}
              </div>
              {!isLast && (
                <svg viewBox="0 0 24 24" className={`my-1 h-5 w-5 shrink-0 text-zinc-400 ${horizontal ? "sm:mx-1 sm:my-0 sm:-rotate-90" : ""}`} aria-hidden="true">
                  <path d="M12 4 L12 18 M6 13 L12 19 L18 13" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </li>
          );
        })}
      </ol>
    </Frame>
  );
}

/* ---------- pot-section ----------
 * 鉢の断面。列は上の層から順に: 名前 | 説明 | soil/stone/hydro/bark/mulch/water | 厚さの比（任意、既定1）
 *   water は層ではなく、鉢底からの水位として重ねる（比は鉢の高さに対する割合 0〜1、既定0.2）
 * attrs: hole="false" で鉢底穴なし
 */
const LAYER_FILL: Record<string, string> = { soil: "#6b5440", stone: "#cfc6b4", hydro: "#9a5a44", bark: "#8a6844", mulch: "#e3ddd0" };

function LayerTexture({ type, y, h, seed }: { type: string; y: number; h: number; seed: number }) {
  const rand = rng(seed);
  const out: React.ReactNode[] = [];
  if (type === "soil") {
    for (let i = 0; i < Math.round(h * 2.2); i++) out.push(<circle key={i} cx={30 + rand() * 140} cy={y + rand() * h} r={1 + rand() * 1.4} fill={rand() < 0.5 ? "#5a4635" : "#7d644c"} />);
  } else if (type === "stone" || type === "hydro" || type === "mulch") {
    const r = type === "mulch" ? 4.5 : 5.5;
    const cols = type === "hydro" ? ["#9a5a44", "#7f4a37", "#b07a5f", "#d9d3c4"] : type === "mulch" ? ["#efeae0", "#d9d2c3", "#c9c1b0"] : ["#d6cdbb", "#bfb49e", "#e3dccd"];
    for (let yy = y + r; yy < y + h + r * 0.5; yy += r * 1.7) {
      for (let x = 24 + rand() * 4; x < 178; x += r * 1.9) out.push(<circle key={`${x}-${yy}`} cx={x} cy={yy} r={r * (0.8 + rand() * 0.3)} fill={cols[Math.floor(rand() * cols.length)]} />);
    }
  } else if (type === "bark") {
    for (let i = 0; i < Math.round(h * 0.9); i++) {
      const x = 28 + rand() * 144;
      const yy = y + rand() * h;
      out.push(<ellipse key={i} cx={x} cy={yy} rx={6} ry={3} transform={`rotate(${rand() * 180} ${x} ${yy})`} fill={rand() < 0.5 ? "#8a6844" : "#6b4f33"} />);
    }
  }
  return <>{out}</>;
}

function PotSection({ block }: { block: IllustBlock }) {
  const layers = block.rows.filter((r) => r[0] && r[2] !== "water");
  const water = block.rows.find((r) => r[2] === "water");
  const hole = block.attrs.hole !== "false";
  const top = 70;
  const bottom = 206;
  const total = layers.reduce((n, r) => n + (Number(r[3]) || 1), 0) || 1;
  const heights = layers.map((r) => ((Number(r[3]) || 1) / total) * (bottom - top));
  const bands = layers.map((r, i) => ({ y: top + heights.slice(0, i).reduce((a, b) => a + b, 0), h: heights[i], type: r[2] || "soil", i }));
  const waterRatio = water ? Math.min(1, Number(water[3]) || 0.2) : 0;
  const waterTop = bottom - waterRatio * (bottom - top);
  const pot = "M18 64 L182 64 L164 210 L36 210 Z";
  const swatch = (t: string) => (t === "water" ? C.water : LAYER_FILL[t] ?? "#6b5440");
  return (
    <Frame block={block}>
      <div className="grid grid-cols-[minmax(0,44%)_1fr] items-center gap-4">
        <svg viewBox="0 0 200 222" className="block w-full" aria-hidden="true">
          <defs>
            <clipPath id={`pot-${block.title.length}`}>
              <path d="M22 66 L178 66 L161 206 L39 206 Z" />
            </clipPath>
          </defs>
          {/* 植物 */}
          <path d="M100 70 C98 50 96 36 92 22" stroke={C.leafD} strokeWidth={3} fill="none" />
          <ellipse cx={74} cy={30} rx={26} ry={12} transform="rotate(-25 74 30)" fill={C.leaf} />
          <ellipse cx={124} cy={26} rx={28} ry={12} transform="rotate(20 124 26)" fill={C.leafD} />
          <ellipse cx={96} cy={14} rx={12} ry={14} fill={C.leaf} />
          <path d={pot} fill="#d9b796" />
          <g clipPath={`url(#pot-${block.title.length})`}>
            {bands.map((b) => (
              <g key={b.i}>
                <rect x={0} y={b.y} width={200} height={b.h + 0.5} fill={LAYER_FILL[b.type] ?? "#6b5440"} />
                <LayerTexture type={b.type} y={b.y} h={b.h} seed={b.i * 17 + 3} />
              </g>
            ))}
            {/* 根 */}
            <g stroke="#f3ead8" strokeWidth={2} fill="none" strokeLinecap="round" opacity={0.9}>
              <path d="M100 72 C94 100 80 120 70 150" />
              <path d="M100 72 C104 104 118 124 130 152" />
              <path d="M100 72 C100 110 98 130 100 166" />
              <path d="M86 112 C76 118 66 124 58 128" />
              <path d="M112 116 C124 120 134 128 142 130" />
            </g>
            {water && <rect x={0} y={waterTop} width={200} height={bottom - waterTop + 6} fill={C.water} opacity={0.55} />}
            {water && <line x1={0} y1={waterTop} x2={200} y2={waterTop} stroke={C.blue} strokeWidth={1.5} strokeDasharray="4 3" />}
          </g>
          <path d={pot} fill="none" stroke="#b08a66" strokeWidth={4} strokeLinejoin="round" />
          {hole ? (
            <>
              <rect x={90} y={206} width={20} height={6} fill="#f3f0ea" />
              <path d="M100 214 L100 220" stroke={C.blue} strokeWidth={2} strokeLinecap="round" />
            </>
          ) : null}
        </svg>
        <ul className="space-y-2.5">
          {block.rows
            .filter((r) => r[0])
            .map((r, i) => (
              <li key={i} className="flex gap-2">
                <span className="mt-1 inline-block h-3 w-3 shrink-0 rounded-sm ring-1 ring-black/10" style={{ background: swatch(r[2] || "soil") }} />
                <span className="leading-snug">
                  <b className="block text-[13px] text-zinc-800">{r[0]}</b>
                  {r[1] && <span className="text-[12px] text-zinc-500">{r[1]}</span>}
                </span>
              </li>
            ))}
          {!hole && <li className="text-[11.5px] text-zinc-500">※鉢底穴のない鉢</li>}
        </ul>
      </div>
    </Frame>
  );
}

/* ---------- roots ----------
 * 根の状態の見分け。列: ラベル | 説明 | healthy/rotten/bound/dry
 */
function RootsIcon({ type, seed }: { type: string; seed: number }) {
  const rand = rng(seed);
  const strands: React.ReactNode[] = [];
  const n = type === "bound" ? 9 : 11;
  for (let i = 0; i < n; i++) {
    const sx = 60 + (rand() - 0.5) * 14;
    const ex = 14 + (i / (n - 1)) * 92 + (rand() - 0.5) * 8;
    const ey = 86 + rand() * 22;
    const cx = (sx + ex) / 2 + (rand() - 0.5) * 20;
    let color = "#f4ecd9";
    let w = 2.4;
    if (type === "rotten") {
      color = rand() < 0.75 ? "#2b2119" : "#8d7a5f";
      w = 3;
    } else if (type === "dry") {
      color = "#c9b48f";
      w = 1.4;
    }
    const d = type === "bound" ? `M${sx} 26 Q${cx} 60 ${ex} ${Math.min(ey, 96)}` : `M${sx} 26 Q${cx} 60 ${ex} ${ey}`;
    strands.push(<path key={i} d={d} stroke={color} strokeWidth={w} fill="none" strokeLinecap="round" />);
    if (type === "healthy" && i % 2 === 0) {
      const hx = (sx + ex) / 2;
      strands.push(<path key={`h${i}`} d={`M${hx} 66 l${(rand() - 0.5) * 12} 8`} stroke="#f4ecd9" strokeWidth={1} />);
    }
    if (type === "rotten" && i % 3 === 0) strands.push(<ellipse key={`b${i}`} cx={ex} cy={ey - 6} rx={4} ry={3} fill="#1f1812" />);
  }
  return (
    <svg viewBox="0 0 120 120" className="mx-auto block w-full max-w-[140px] rounded-xl" aria-hidden="true">
      <rect width={120} height={120} rx={12} fill={type === "rotten" ? "#8b7358" : "#7a6149"} />
      {type === "bound" && (
        <g stroke="#f4ecd9" strokeWidth={2.2} fill="none">
          <path d="M14 104 Q60 116 106 104" />
          <path d="M12 98 Q60 112 108 98" />
          <path d="M16 110 Q60 120 104 110" />
          <path d="M12 60 Q8 84 14 104" />
          <path d="M108 60 Q112 84 106 104" />
        </g>
      )}
      {strands}
      {/* 株元 */}
      <rect x={50} y={8} width={20} height={20} rx={4} fill={C.leafD} />
      {type === "rotten" && (
        <g stroke="#e8dcc6" strokeWidth={1.3} fill="none" opacity={0.8}>
          <path d="M92 14 q4 4 0 8 q-4 4 0 8" />
          <path d="M100 12 q4 4 0 8 q-4 4 0 8" />
        </g>
      )}
    </svg>
  );
}

function Roots({ block }: { block: IllustBlock }) {
  const rows = block.rows.filter((r) => r[0]);
  const cols = rows.length >= 3 ? "grid-cols-3" : "grid-cols-2";
  return (
    <Frame block={block}>
      <div className={`grid ${cols} gap-3 sm:gap-6`}>
        {rows.map((r, i) => (
          <div key={i} className="text-center">
            <RootsIcon type={r[2] || "healthy"} seed={5 + i * 13} />
            <p className={`mt-2 text-[13px] font-bold ${r[2] === "rotten" ? "text-[#8f3a26]" : r[2] === "healthy" ? "text-[#22614c]" : "text-zinc-700"}`}>{r[0]}</p>
            {r[1] && <p className="mt-0.5 text-[12px] leading-snug text-zinc-500">{r[1]}</p>}
          </div>
        ))}
      </div>
    </Frame>
  );
}

/* ---------- room-zones ----------
 * 部屋の断面で置き場所を示す。列: 名前 | 説明 | window/good/heater/floor/high（棚の上）
 *   図の中の番号は箇条書きの順番。window は窓際、good は部屋の内側、heater は暖房の近く、floor は床の直置き、high は高い棚
 * attrs: heater="false" で暖房を描かない
 */
const ZONE_POS: Record<string, { x: number; y: number }> = {
  window: { x: 52, y: 128 },
  good: { x: 168, y: 112 },
  heater: { x: 262, y: 128 },
  floor: { x: 104, y: 176 },
  high: { x: 168, y: 46 },
};
const ZONE_TONE: Record<string, string> = { window: "#3f7fb8", good: "#22614c", heater: "#c0573f", floor: "#3f7fb8", high: "#c98a2b" };

function RoomZones({ block }: { block: IllustBlock }) {
  const rows = block.rows.filter((r) => r[0]);
  const types = rows.map((r) => r[2] || "good");
  const showHeater = block.attrs.heater !== "false" && types.includes("heater");
  return (
    <Frame block={block}>
      <svg viewBox="0 0 330 200" className="mx-auto block w-full max-w-[480px]" aria-hidden="true">
        {/* 壁と床 */}
        <rect x={0} y={0} width={330} height={190} fill="#fbf9f5" />
        <rect x={0} y={190} width={330} height={10} fill="#d8cdbb" />
        {/* 窓 */}
        <rect x={0} y={24} width={16} height={130} fill="#cfe3f3" stroke="#9fb6c8" strokeWidth={2} />
        <line x1={8} y1={24} x2={8} y2={154} stroke="#9fb6c8" strokeWidth={1.5} />
        {/* 冷気 */}
        <rect x={16} y={24} width={90} height={166} fill="url(#coldgrad)" />
        <defs>
          <linearGradient id="coldgrad" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#7fb6e3" stopOpacity={0.35} />
            <stop offset="1" stopColor="#7fb6e3" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="warmgrad" x1="1" x2="0" y1="0" y2="0">
            <stop offset="0" stopColor="#e9a28a" stopOpacity={0.4} />
            <stop offset="1" stopColor="#e9a28a" stopOpacity={0} />
          </linearGradient>
        </defs>
        <g stroke={C.blue} strokeWidth={2} fill="none" strokeLinecap="round" opacity={0.8}>
          <path d="M24 40 L24 150 Q24 178 50 180 L120 182" />
          <path d="M116 177 L122 182 L116 187" />
          <path d="M36 60 L36 150 Q36 168 56 170 L92 171" />
        </g>
        {/* 暖房 */}
        {showHeater && (
          <>
            <rect x={220} y={100} width={92} height={90} fill="url(#warmgrad)" />
            <rect x={300} y={128} width={26} height={62} rx={3} fill="#e7e2da" stroke="#b9b1a4" />
            <g stroke="#c0573f" strokeWidth={1.8} fill="none" strokeLinecap="round">
              <path d="M292 138 q-6 -4 -12 0 q-6 4 -12 0" />
              <path d="M292 150 q-6 -4 -12 0 q-6 4 -12 0" />
              <path d="M292 162 q-6 -4 -12 0 q-6 4 -12 0" />
            </g>
          </>
        )}
        {/* 棚 */}
        {types.includes("high") && <rect x={130} y={66} width={76} height={5} fill="#b8a991" />}
        {/* 鉢と番号 */}
        {rows.map((r, i) => {
          const p = ZONE_POS[types[i]] ?? ZONE_POS.good;
          const floorY = types[i] === "high" ? 66 : types[i] === "floor" ? 190 : 190;
          const stand = types[i] !== "high" && types[i] !== "floor";
          return (
            <g key={i}>
              {stand && <rect x={p.x - 3} y={150} width={6} height={40} fill="#b8a991" />}
              {stand && <rect x={p.x - 18} y={146} width={36} height={5} fill="#b8a991" />}
              <g transform={`translate(${p.x} ${stand ? 146 : floorY})`}>
                <path d="M-11 -20 L11 -20 L8 0 L-8 0 Z" fill={C.pot} />
                <ellipse cx={-7} cy={-28} rx={9} ry={5} transform="rotate(-30 -7 -28)" fill={C.leaf} />
                <ellipse cx={8} cy={-30} rx={10} ry={5} transform="rotate(30 8 -30)" fill={C.leafD} />
              </g>
              <circle cx={p.x + 18} cy={(stand ? 146 : floorY) - 42} r={10} fill={ZONE_TONE[types[i]] ?? C.green} />
              <text x={p.x + 18} y={(stand ? 146 : floorY) - 38} fontSize={12} fontWeight={700} fill="#fff" textAnchor="middle">
                {i + 1}
              </text>
            </g>
          );
        })}
      </svg>
      <ol className="mt-3 space-y-1.5">
        {rows.map((r, i) => (
          <li key={i} className="flex gap-2 text-[12.5px] leading-snug">
            <span className="mt-px inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white" style={{ background: ZONE_TONE[types[i]] ?? C.green }}>
              {i + 1}
            </span>
            <span>
              <b className="text-zinc-800">{r[0]}</b>
              {r[1] && <span className="text-zinc-500">　{r[1]}</span>}
            </span>
          </li>
        ))}
      </ol>
    </Frame>
  );
}

/* ---------- leaf-check ----------
 * 葉の症状。列: 症状 | 原因・対処 | healthy/yellow/brown-tip/spots/droop/curl/pale/burn/black
 */
const LEAF_PATH = "M60 108 C26 92 14 58 30 26 C42 6 78 6 90 26 C106 58 94 92 60 108 Z";
function LeafIcon({ type, idx }: { type: string; idx: number }) {
  const id = `leaf-${idx}-${type}`;
  const base = type === "yellow" ? "#d9c24f" : type === "pale" ? "#a9c98f" : C.leaf;
  const leaf = (
    <>
      <defs>
        <clipPath id={id}>
          <path d={LEAF_PATH} />
        </clipPath>
      </defs>
      <path d={LEAF_PATH} fill={base} />
      <g clipPath={`url(#${id})`}>
        {type === "brown-tip" && <path d="M0 0 L120 0 L120 28 Q60 40 0 28 Z" fill="#9a6a3c" />}
        {type === "yellow" && <path d="M0 70 L120 70 L120 120 L0 120 Z" fill="#c9a640" opacity={0.6} />}
        {type === "spots" &&
          [
            [44, 46], [74, 40], [56, 72], [80, 70], [40, 80],
          ].map(([x, y], i) => (
            <g key={i}>
              <circle cx={x} cy={y} r={7} fill="#e3d46a" />
              <circle cx={x} cy={y} r={4.5} fill="#6b4a2c" />
            </g>
          ))}
        {type === "burn" && <path d="M44 34 C60 26 82 36 78 54 C74 70 50 66 42 54 C38 46 38 38 44 34 Z" fill="#efe9d8" stroke="#a7835a" strokeWidth={2} />}
        {type === "black" && <path d="M0 84 Q40 70 60 86 Q84 70 120 82 L120 120 L0 120 Z" fill="#2e2620" />}
      </g>
      <path d="M60 108 L60 20" stroke="#2f5e3b" strokeWidth={2} opacity={type === "pale" ? 0.4 : 0.7} />
    </>
  );
  if (type === "droop") {
    return (
      <svg viewBox="0 0 120 120" className="mx-auto block w-full max-w-[110px]" aria-hidden="true">
        <path d="M40 118 Q34 70 50 40" stroke={C.leafD} strokeWidth={3} fill="none" />
        <g transform="translate(50 40) rotate(155) scale(0.75) translate(-60 -108)">{leaf}</g>
      </svg>
    );
  }
  if (type === "curl") {
    return (
      <svg viewBox="0 0 120 120" className="mx-auto block w-full max-w-[110px]" aria-hidden="true">
        <g transform="translate(60 0) scale(0.55 1) translate(-60 0)">{leaf}</g>
        <path d="M44 24 C30 50 32 84 58 106" stroke="#2f5e3b" strokeWidth={2} fill="none" opacity={0.5} />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 120 120" className="mx-auto block w-full max-w-[110px]" aria-hidden="true">
      {leaf}
    </svg>
  );
}

function LeafCheck({ block }: { block: IllustBlock }) {
  const rows = block.rows.filter((r) => r[0]);
  const cols = rows.length === 2 || rows.length === 4 ? "grid-cols-2" : "grid-cols-3";
  return (
    <Frame block={block}>
      <div className={`grid ${cols} gap-x-3 gap-y-5 ${rows.length >= 4 ? "sm:grid-cols-4" : ""}`}>
        {rows.map((r, i) => (
          <div key={i} className="text-center">
            <div className="rounded-xl bg-white/70 p-2">
              <LeafIcon type={r[2] || "healthy"} idx={i} />
            </div>
            <p className="mt-2 text-[13px] font-bold leading-snug text-zinc-800">{r[0]}</p>
            {r[1] && <p className="mt-0.5 text-[12px] leading-snug text-zinc-500">{r[1]}</p>}
          </div>
        ))}
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
      return <RangeBars block={block} defaultUnit="µmol/m²/s" />;
    case "range":
      return <RangeBars block={block} />;
    case "flow":
      return <Flow block={block} />;
    case "pot-section":
      return <PotSection block={block} />;
    case "roots":
      return <Roots block={block} />;
    case "room-zones":
      return <RoomZones block={block} />;
    case "leaf-check":
      return <LeafCheck block={block} />;
  }
  return null;
}
