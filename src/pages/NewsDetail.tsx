import { useEffect, useState } from 'react';
import { ArrowLeft, Calendar, Newspaper } from 'lucide-react';
import { Link, useRouter } from '@/lib/router';
import { supabase } from '@/lib/supabase';
import type { NewsArticle } from '@/lib/types';
import { formatDate } from '@/lib/format';

export default function NewsDetail({ id }: { id: string }) {
  const { navigate } = useRouter();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArticle() {
      const { data } = await supabase.from('news').select('*').eq('id', id).maybeSingle();
      setArticle(data);
      setLoading(false);
    }
    fetchArticle();
  }, [id]);

  if (loading) {
    return (
      <div className="pt-16 container-max section-padding py-10">
        <div className="skeleton h-8 w-3/4 mb-4" />
        <div className="skeleton h-4 w-1/3 mb-8" />
        <div className="skeleton h-4 w-full mb-2" />
        <div className="skeleton h-4 w-full mb-2" />
        <div className="skeleton h-4 w-2/3" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="pt-16 container-max section-padding py-20 text-center">
        <Newspaper className="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-slate-900 mb-2">Article not found</h2>
        <button onClick={() => navigate('/news')} className="btn-primary mt-4">Back to News</button>
      </div>
    );
  }

  return (
    <div className="pt-16">
      <article className="container-max section-padding py-10 max-w-3xl">
        <Link to="/news" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-primary-700 mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to News
        </Link>
        <span className="badge bg-primary-50 text-primary-700 mb-4">{article.category}</span>
        <h1 className="text-2xl lg:text-4xl font-bold text-slate-900 mb-4 text-balance">{article.title}</h1>
        <div className="flex items-center gap-2 text-sm text-slate-400 mb-8">
          <Calendar className="w-4 h-4" />
          {formatDate(article.created_at)}
        </div>
        <p className="text-lg text-slate-600 leading-relaxed mb-6 font-medium">{article.excerpt}</p>
        <div className="prose prose-slate max-w-none">
          <p className="text-slate-700 leading-relaxed whitespace-pre-line">{article.content}</p>
        </div>
      </article>
    </div>
  );
}
