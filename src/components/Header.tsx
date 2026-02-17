import Link from "next/link";
import { categories } from "@/lib/categories";

export default function Header() {
  return (
    <header className="border-b border-gray-100 bg-white">
      <div className="mx-auto max-w-5xl px-4 py-5 flex items-center justify-between">
        <Link href="/" className="text-lg font-extrabold tracking-tight text-gray-900">
          tokyoplants
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-[13px]">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/${cat.slug}`}
              className="text-gray-500 hover:text-gray-900 transition-colors"
            >
              {cat.name}
            </Link>
          ))}
          <a
            href="https://www.tokyoplants.com"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-teal-700 px-4 py-1.5 text-xs font-semibold text-white hover:bg-teal-800 transition-colors"
          >
            SHOP
          </a>
        </nav>
        <form action="/search" method="get" className="hidden md:flex items-center gap-2">
          <input
            type="search"
            name="q"
            placeholder="記事を検索"
            className="w-44 rounded-full border border-gray-200 bg-white px-4 py-2 text-xs text-gray-700 placeholder:text-gray-400 focus:border-teal-600 focus:outline-none"
          />
          <button
            type="submit"
            className="rounded-full bg-gray-900 px-4 py-2 text-xs font-semibold text-white hover:bg-gray-700 transition-colors"
          >
            検索
          </button>
        </form>
        <Link
          href="/search"
          className="md:hidden rounded-full border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700"
        >
          検索
        </Link>
      </div>
    </header>
  );
}
