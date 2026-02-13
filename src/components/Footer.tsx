import Link from "next/link";
import { categories } from "@/lib/categories";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50 mt-16">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div>
            <Link href="/" className="text-lg font-bold text-green-700">
              BOTANY LIFE
            </Link>
            <p className="mt-2 text-sm text-gray-500">
              観葉植物の育て方・図鑑・レビューをお届けするメディア
            </p>
          </div>
          <nav className="flex flex-wrap gap-4 text-sm">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/${cat.slug}`}
                className="text-gray-500 hover:text-green-700 transition-colors"
              >
                {cat.name}
              </Link>
            ))}
            <Link href="/about" className="text-gray-500 hover:text-green-700 transition-colors">
              About
            </Link>
          </nav>
        </div>
        <p className="mt-8 text-xs text-gray-400 text-center">
          &copy; {new Date().getFullYear()} BOTANY LIFE. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
