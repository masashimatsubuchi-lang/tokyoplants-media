import ArticleCard from "@/components/ArticleCard";
import { getCategoryBySlug } from "@/lib/categories";
import { getAllPosts } from "@/lib/posts";

type SearchPageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = (params.q ?? "").trim();
  const normalized = query.toLowerCase();

  const posts = getAllPosts();
  const results =
    normalized.length === 0
      ? []
      : posts.filter((post) => {
          const categoryName = getCategoryBySlug(post.category)?.name ?? "";
          const haystack = [post.title, post.description, categoryName, post.author]
            .join(" ")
            .toLowerCase();
          return haystack.includes(normalized);
        });

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900">記事検索</h1>
      <p className="mt-2 text-sm text-gray-500">タイトル・説明・カテゴリ・著者で検索できます。</p>

      <form action="/search" method="get" className="mt-6 flex gap-2">
        <input
          type="search"
          name="q"
          defaultValue={query}
          placeholder="例: モンステラ、土、植え替え"
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-700 placeholder:text-gray-400 focus:border-teal-600 focus:outline-none"
        />
        <button
          type="submit"
          className="shrink-0 rounded-xl bg-teal-700 px-5 py-3 text-sm font-semibold text-white hover:bg-teal-800 transition-colors"
        >
          検索
        </button>
      </form>

      {query.length === 0 ? (
        <p className="mt-8 text-sm text-gray-400">キーワードを入力して検索してください。</p>
      ) : results.length === 0 ? (
        <p className="mt-8 text-sm text-gray-400">「{query}」に一致する記事は見つかりませんでした。</p>
      ) : (
        <>
          <p className="mt-8 text-sm text-gray-500">「{query}」の検索結果: {results.length}件</p>
          <div className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((post) => (
              <ArticleCard key={`${post.category}-${post.slug}`} post={post} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
