import Link from "next/link";
import { categories } from "@/lib/categories";

export default function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-green-700">
          BOTANY LIFE
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
        </nav>
      </div>
    </header>
  );
}
