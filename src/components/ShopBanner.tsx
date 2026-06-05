export default function ShopBanner() {
  return (
    <section className="mt-12 rounded-xl border border-teal-100 bg-teal-50/40 p-8">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-teal-700">tokyoplants Online Shop</p>
      <p className="mt-3 text-sm leading-[1.9] text-zinc-700">
        東京都世田谷区の小さなマンションで、希少な観葉植物を育てています。仲介業者を通さず、自ら海外まで足を運び、現地で一点ずつ厳選して買い付けた希少植物たち。国内ではなかなか出会えない珍しい品種を、手の届きやすい価格でご紹介しています。
      </p>
      <a
        href="https://www.tokyoplants.com"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 inline-block rounded-full bg-teal-700 px-6 py-2.5 text-sm font-semibold text-white hover:bg-teal-800 transition-colors"
      >
        ショップを見る →
      </a>
    </section>
  );
}
