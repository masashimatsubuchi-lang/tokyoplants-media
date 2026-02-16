import Link from "next/link";
import { categories } from "@/lib/categories";

export default function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-baseline gap-1.5">
          <span className="text-xl font-extrabold tracking-tight text-gray-900">tokyoplants</span>
          <span className="text-xs font-semibold uppercase tracking-widest text-green-700">Media</span>
        </Link>
        <nav className="hidden md:flex gap-6 text-sm">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/${cat.slug}`}
              className="text-gray-600 hover:text-green-700 transition-colors"
            >
              {cat.name}
            </Link>
          ))}
          <Link href="/about" className="text-gray-600 hover:text-green-700 transition-colors">
            About
          </Link>
          <a
            href="https://www.tokyoplants.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-green-700 hover:text-green-900 transition-colors"
          >
            SHOP
          </a>
        </nav>
      </div>
    </header>
  );
}
