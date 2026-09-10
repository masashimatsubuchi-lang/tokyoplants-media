import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DEFAULT_AUTHOR_SLUG, getAllAuthors, getAuthorBySlug } from "@/lib/authors";
import { getPostsByAuthor } from "@/lib/posts";
import ArticleCard from "@/components/ArticleCard";

const siteUrl = "https://media.tokyoplants.com";
const ARTICLES_SHOWN = 24;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllAuthors().map((author) => ({ slug: author.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const author = getAuthorBySlug(slug);
  if (!author) return {};
  const title = `${author.name}（${author.role}）`;
  const url = `/author/${author.slug}`;
  return {
    title,
    description: author.bio,
    alternates: { canonical: url },
    openGraph: {
      type: "profile",
      url,
      title,
      description: author.bio,
    },
  };
}

export default async function AuthorPage({ params }: Props) {
  const { slug } = await params;
  const author = getAuthorBySlug(slug);
  if (!author) notFound();

  const posts = getPostsByAuthor(author.slug, DEFAULT_AUTHOR_SLUG);
  const shownPosts = posts.slice(0, ARTICLES_SHOWN);

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: {
      "@type": "Person",
      name: author.name,
      jobTitle: author.role,
      description: author.bioLong,
      image: `${siteUrl}${author.image}`,
      url: `${siteUrl}/author/${author.slug}`,
      worksFor: {
        "@type": "Organization",
        name: "tokyoplants",
        url: "https://www.tokyoplants.com",
      },
      knowsAbout: author.specialties,
      sameAs: author.sameAs,
    },
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 md:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />

      <nav className="mb-6 text-[13px] text-zinc-400">
        <Link href="/" className="hover:text-zinc-900 transition-colors">トップ</Link>
        <span className="mx-2">/</span>
        <span className="text-zinc-600">{author.name}</span>
      </nav>

      <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
        <Image
          src={author.image}
          alt={author.name}
          width={112}
          height={112}
          className="h-28 w-28 shrink-0 rounded-full object-cover"
        />
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-teal-700">Author</p>
          <h1 className="mt-1 text-2xl md:text-3xl font-extrabold tracking-tight text-zinc-900">
            {author.name} <span className="font-normal text-zinc-500">/ tokyoplants</span>
          </h1>
          <p className="mt-1 text-sm text-zinc-500">{author.role}</p>
        </div>
      </div>

      <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-zinc-600">{author.bioLong}</p>

      <div className="mt-5 flex flex-wrap gap-2">
        {author.specialties.map((s) => (
          <span
            key={s}
            className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-[12px] font-medium text-gray-600"
          >
            #{s}
          </span>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <a
          href="https://www.tokyoplants.com"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-emerald-700 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-800 transition-colors"
        >
          tokyoplants ショップを見る →
        </a>
        <a
          href="https://www.instagram.com/tokyoplants.jp"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-700 hover:border-teal-400 hover:text-teal-700 transition-colors"
        >
          Instagram
        </a>
      </div>

      {shownPosts.length > 0 && (
        <section className="mt-14">
          <h2 className="text-xl font-extrabold tracking-tight text-gray-900">執筆記事一覧</h2>
          <p className="mt-1 text-[13px] text-gray-500">
            {posts.length}本の記事のうち、新しい{shownPosts.length}本を表示しています
          </p>
          <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {shownPosts.map((post) => (
              <ArticleCard key={`${post.category}-${post.slug}`} post={post} />
            ))}
          </div>
          {posts.length > ARTICLES_SHOWN && (
            <div className="mt-8 text-center">
              <Link
                href="/search"
                className="text-sm font-semibold text-teal-700 hover:text-teal-900 hover:underline"
              >
                他の記事を探す →
              </Link>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
