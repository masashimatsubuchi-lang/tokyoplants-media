import Image from "next/image";
import Link from "next/link";
import { Author } from "@/lib/authors";

export default function AuthorCard({ author }: { author: Author }) {
  return (
    <div className="mt-12 rounded-xl border border-gray-100 bg-gray-50/60 p-5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-teal-700">この記事を書いた人</p>
      <div className="mt-3 flex items-start gap-4">
        <Image
          src={author.image}
          alt={author.name}
          width={64}
          height={64}
          className="h-16 w-16 shrink-0 rounded-full object-cover"
        />
        <div className="min-w-0">
          <p className="text-[15px] font-bold text-gray-900">
            {author.name} <span className="font-normal text-gray-500">/ tokyoplants</span>
          </p>
          <p className="text-[13px] text-gray-500">{author.role}</p>
          <p className="mt-2 text-[13px] leading-relaxed text-gray-600">{author.bio}</p>
          <Link
            href={`/author/${author.slug}`}
            className="mt-2 inline-block text-[13px] font-semibold text-teal-700 hover:text-teal-900 hover:underline"
          >
            プロフィールを見る →
          </Link>
        </div>
      </div>
    </div>
  );
}
