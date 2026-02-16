import Link from "next/link";
import { categories } from "@/lib/categories";

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white mt-0">
      <div className="mx-auto max-w-5xl px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div>
            <Link href="/" className="text-lg font-extrabold tracking-tight text-gray-900">
              tokyoplants
            </Link>
            <p className="mt-2 text-[13px] leading-relaxed text-gray-400">
              観葉植物の育て方・図鑑・レビューをお届けするメディア
            </p>
          </div>
          <nav className="flex flex-wrap gap-5 text-[13px]">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/${cat.slug}`}
                className="text-gray-400 hover:text-gray-900 transition-colors"
              >
                {cat.name}
              </Link>
            ))}
            <a
              href="https://www.tokyoplants.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-teal-700 hover:text-teal-800 transition-colors"
            >
              SHOP
            </a>
          </nav>
        </div>
        <p className="mt-10 text-[11px] text-gray-300">
          &copy; {new Date().getFullYear()} tokyoplants. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
