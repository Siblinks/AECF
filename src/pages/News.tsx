import { useEffect, useState } from 'react';
import { Newspaper, Search } from 'lucide-react';
import { Link } from '@/lib/router';
import { supabase } from '@/lib/supabase';
import type { NewsArticle } from '@/lib/types';
import { NEWS_CATEGORIES } from '@/lib/constants';
import { truncate, formatRelativeTime } from '@/lib/format';

export default function News() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  useEffect(() => {
    async function fetchNews() {
      let query = supabase.from('news').select('*').eq('published', true).order('created_at', { ascending: false });
      const { data } = await query;
      setArticles(data || []);
      setLoading(false);
    }
    fetchNews();
  }, []);

  const filtered = articles.filter((a) => {
    const matchesSearch = !search || a.title.toLowerCase().includes(search.toLowerCase()) || a.excerpt.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'all' || a.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="pt-16">
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 py-16 lg:py-20">
        <div className="container-max section-padding">
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3">News & Updates</h1>
          <p className="text-white/70 text-lg max-w-2xl">
            Stay informed about the latest developments, announcements, and community initiatives across Agaie LGA.
          </p>
        </div>
      </section>

      <section className="container-max section-padding py-10">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search news..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input pl-10"
            />
          </div>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="select sm:w-48">
            <option value="all">All Categories</option>
            {NEWS_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card p-6">
                <div className="skeleton h-4 w-20 mb-4" />
                <div className="skeleton h-5 w-3/4 mb-3" />
                <div className="skeleton h-4 w-full mb-2" />
                <div className="skeleton h-4 w-2/3" />
              </div>
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((article) => (
              <Link key={article.id} to={`/news/${article.id}`} className="card card-hover p-6 block group">
                <div className="flex items-center gap-2 mb-3">
                  <span className="badge bg-primary-50 text-primary-700">{article.category}</span>
                  <span className="text-xs text-slate-400">{formatRelativeTime(article.created_at)}</span>
                </div>
                <h3 className="font-bold text-slate-900 text-lg mb-2 group-hover:text-primary-700 transition-colors">
                  {article.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">{truncate(article.excerpt, 120)}</p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Newspaper className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-400">No news articles found.</p>
          </div>
        )}
      </section>
    </div>
  );
}
