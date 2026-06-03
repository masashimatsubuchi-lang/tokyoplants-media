'use client';

import { useEffect, useState } from 'react';

interface Article {
  slug: string;
  title: string;
  image: string;
  category: string;
  date: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  guide: 'bg-blue-100 text-blue-700',
  soil: 'bg-amber-100 text-amber-700',
  species: 'bg-green-100 text-green-700',
  research: 'bg-purple-100 text-purple-700',
  review: 'bg-pink-100 text-pink-700',
};

export default function AdminPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [images, setImages] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<Record<string, boolean>>({});
  const [dragOver, setDragOver] = useState<Record<string, boolean>>({});
  const [pushing, setPushing] = useState(false);

  useEffect(() => {
    fetch('/api/admin/articles')
      .then((r) => r.json())
      .then((data) => {
        setArticles(data.articles ?? []);
        const imgMap: Record<string, string> = {};
        for (const a of data.articles ?? []) {
          imgMap[a.slug] = a.image;
        }
        setImages(imgMap);
      })
      .finally(() => setLoading(false));
  }, []);

  async function uploadImage(slug: string, file?: File, url?: string) {
    setUploading((prev) => ({ ...prev, [slug]: true }));
    try {
      const formData = new FormData();
      formData.append('slug', slug);
      if (file) {
        formData.append('file', file);
      } else if (url) {
        formData.append('url', url);
      }

      const res = await fetch('/api/admin/article-image', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setImages((prev) => ({ ...prev, [slug]: data.newImage }));
      } else {
        alert('アップロード失敗: ' + (data.error ?? '不明なエラー'));
      }
    } catch (err) {
      alert('エラーが発生しました: ' + err);
    } finally {
      setUploading((prev) => ({ ...prev, [slug]: false }));
    }
  }

  function handleDrop(e: React.DragEvent, slug: string) {
    e.preventDefault();
    setDragOver((prev) => ({ ...prev, [slug]: false }));

    const file = e.dataTransfer.files[0];
    if (file) {
      uploadImage(slug, file);
      return;
    }

    const url =
      e.dataTransfer.getData('text/uri-list') || e.dataTransfer.getData('text/plain');
    if (url) {
      uploadImage(slug, undefined, url);
    }
  }

  async function handleCommitPush() {
    setPushing(true);
    try {
      const res = await fetch('/api/admin/git-push', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        alert('Commit & Push 成功!\n\n' + (data.output ?? ''));
      } else {
        alert('失敗:\n' + (data.error ?? '') + '\n' + (data.stderr ?? ''));
      }
    } catch (err) {
      alert('エラー: ' + err);
    } finally {
      setPushing(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-500 text-lg">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">📸 記事画像管理</h1>
          <button
            onClick={handleCommitPush}
            disabled={pushing}
            className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            {pushing ? '処理中...' : 'Commit & Push'}
          </button>
        </div>
      </header>

      {/* Grid */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {articles.map((article) => {
            const slug = article.slug;
            const isDragOver = dragOver[slug] ?? false;
            const isUploading = uploading[slug] ?? false;
            const imgSrc = images[slug] ?? '';

            return (
              <div
                key={slug}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver((prev) => ({ ...prev, [slug]: true }));
                }}
                onDragLeave={() => setDragOver((prev) => ({ ...prev, [slug]: false }))}
                onDrop={(e) => handleDrop(e, slug)}
                className={`bg-white rounded-xl overflow-hidden shadow-sm border-2 transition-colors ${
                  isDragOver ? 'border-emerald-400 shadow-emerald-100' : 'border-transparent'
                }`}
              >
                {/* Image area */}
                <div className="relative w-full aspect-video bg-gray-200">
                  {imgSrc ? (
                    <img
                      src={imgSrc}
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                      画像なし
                    </div>
                  )}

                  {/* Loading overlay */}
                  {isUploading && (
                    <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                      <svg
                        className="animate-spin h-8 w-8 text-emerald-600"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8H4z"
                        />
                      </svg>
                    </div>
                  )}

                  {/* Drag hint */}
                  {isDragOver && !isUploading && (
                    <div className="absolute inset-0 bg-emerald-500/20 flex items-center justify-center">
                      <span className="text-emerald-700 font-medium text-sm">ドロップして変更</span>
                    </div>
                  )}
                </div>

                {/* Card body */}
                <div className="p-3">
                  <p className="text-sm font-medium text-gray-800 line-clamp-2 leading-snug mb-2">
                    {article.title}
                  </p>
                  <span
                    className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium ${
                      CATEGORY_COLORS[article.category] ?? 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {article.category}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
