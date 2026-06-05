export default function ShopBanner() {
  return (
    <section className="mt-12 overflow-hidden rounded-xl">
      <div
        className="relative px-8 py-12"
        style={{
          backgroundImage: "url('/images/shop-banner.avif')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/55 rounded-xl" />
        {/* Content */}
        <div className="relative z-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-teal-300">tokyoplants Online Shop</p>
          <p className="mt-3 text-sm leading-[1.9] text-white/90 max-w-xl">
            東京都世田谷区の小さなマンションで、希少な観葉植物を育てています。仲介業者を通さず、自ら海外まで足を運び、現地で一点ずつ厳選して買い付けた希少植物たち。国内ではなかなか出会えない珍しい品種を、手の届きやすい価格でご紹介しています。
          </p>
          <a
            href="https://www.tokyoplants.com"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-block rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-zinc-900 hover:bg-gray-100 transition-colors"
          >
            ショップを見る →
          </a>
        </div>
      </div>
    </section>
  );
}
