export default function ShopBanner() {
  return (
    <section className="mt-12 rounded-xl bg-gradient-to-r from-green-700 to-green-600 p-8 text-center">
      <p className="text-sm font-medium text-green-200">TOKYO PLANTS</p>
      <h3 className="mt-2 text-xl font-bold text-white">
        お気に入りの植物を見つけよう
      </h3>
      <p className="mt-2 text-sm text-green-100">
        Anthurium・Monstera・Philodendron など希少植物を取り揃えています
      </p>
      <a
        href="https://www.tokyoplants.com"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-block rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-green-700 hover:bg-green-50 transition-colors"
      >
        ショップを見る
      </a>
    </section>
  );
}
