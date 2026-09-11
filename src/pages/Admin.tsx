import { useEffect, useState, useMemo } from 'react';
import {
  LayoutDashboard, Users, Newspaper, FolderKanban, BarChart3, FileText,
  Search, BadgeCheck, Flag, Check, X, Loader2, TrendingUp, MapPin, Award, Briefcase,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { IndigeneWithWard, NewsArticle, Project, Ward } from '@/lib/types';
import { PILLARS, getStatusInfo } from '@/lib/constants';
import StatusBadge from '@/components/StatusBadge';
import { formatDate, getInitials } from '@/lib/format';

type Tab = 'overview' | 'users' | 'news' | 'projects' | 'analytics' | 'reports' | 'audit';

export default function Admin() {
  const [tab, setTab] = useState<Tab>('overview');
  const [indigenes, setIndigenes] = useState<IndigeneWithWard[]>([]);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      const [indRes, newsRes, projRes, wardsRes] = await Promise.all([
        supabase.from('indigenes').select('*, wards(*)').order('created_at', { ascending: false }),
        supabase.from('news').select('*').order('created_at', { ascending: false }),
        supabase.from('projects').select('*').order('created_at', { ascending: false }),
        supabase.from('wards').select('*').order('name'),
      ]);
      setIndigenes((indRes.data || []) as IndigeneWithWard[]);
      setNews(newsRes.data || []);
      setProjects(projRes.data || []);
      setWards(wardsRes.data || []);
      setLoading(false);
    }
    fetchData();
  }, []);

  async function updateIndigene(id: string, field: 'verified' | 'flagged', value: boolean) {
    setUpdating(id);
    await supabase.from('indigenes').update({ [field]: value }).eq('id', id);
    setIndigenes((prev) => prev.map((i) => (i.id === id ? { ...i, [field]: value } : i)));
    setUpdating(null);
  }

  const filteredIndigenes = indigenes.filter(
    (i) => !search || i.full_name.toLowerCase().includes(search.toLowerCase()) || (i.phone || '').includes(search)
  );

  // Analytics data
  const wardData = useMemo(() => {
    const counts: Record<string, number> = {};
    indigenes.forEach((i) => {
      const name = i.wards?.name || 'Unknown';
      counts[name] = (counts[name] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [indigenes]);

  const eduData = useMemo(() => {
    const counts: Record<string, number> = {};
    indigenes.forEach((i) => {
      const q = i.qualification || 'Unknown';
      counts[q] = (counts[q] || 0) + 1;
    });
    return Object.entries(counts);
  }, [indigenes]);

  const empData = useMemo(() => {
    const counts: Record<string, number> = {};
    indigenes.forEach((i) => {
      const s = i.employment_status || 'Unknown';
      counts[s] = (counts[s] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [indigenes]);

  const maxWardCount = Math.max(...wardData.map(([, c]) => c), 1);
  const maxEmpCount = Math.max(...empData.map(([, c]) => c), 1);

  const verifiedCount = indigenes.filter((i) => i.verified).length;
  const flaggedCount = indigenes.filter((i) => i.flagged).length;

  const MENU: { key: Tab; label: string; icon: typeof LayoutDashboard }[] = [
    { key: 'overview', label: 'Overview', icon: LayoutDashboard },
    { key: 'users', label: 'User Verification', icon: Users },
    { key: 'news', label: 'News CMS', icon: Newspaper },
    { key: 'projects', label: 'Projects CMS', icon: FolderKanban },
    { key: 'analytics', label: 'Analytics', icon: BarChart3 },
    { key: 'reports', label: 'Reports', icon: FileText },
    { key: 'audit', label: 'Audit Logs', icon: FileText },
  ];

  return (
    <div className="pt-16 min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-60 bg-white border-r border-slate-200 fixed top-16 bottom-0 left-0 pt-6">
        <div className="px-4 mb-6">
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Admin Dashboard</h2>
        </div>
        <nav className="flex-1 px-3 space-y-1">
          {MENU.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.key}
                onClick={() => setTab(item.key)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  tab === item.key
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Mobile Tab Selector */}
      <div className="lg:hidden fixed top-16 left-0 right-0 z-30 bg-white border-b border-slate-200 overflow-x-auto scrollbar-hide">
        <div className="flex gap-1 px-3 py-2">
          {MENU.map((item) => (
            <button
              key={item.key}
              onClick={() => setTab(item.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                tab === item.key ? 'bg-primary-50 text-primary-700' : 'text-slate-500'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 lg:ml-60 section-padding py-6 lg:py-8 mt-12 lg:mt-0">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-primary-600" />
          </div>
        ) : (
          <>
            {/* Overview */}
            {tab === 'overview' && (
              <div className="space-y-6">
                <h1 className="text-2xl font-bold text-slate-900">Overview</h1>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: 'Total Indigenes', value: indigenes.length, icon: Users, color: 'bg-primary-100 text-primary-700' },
                    { label: 'Verified', value: verifiedCount, icon: BadgeCheck, color: 'bg-success-100 text-success-700' },
                    { label: 'Flagged', value: flaggedCount, icon: Flag, color: 'bg-error-100 text-error-600' },
                    { label: 'Active Projects', value: projects.filter((p) => p.status === 'ongoing').length, icon: FolderKanban, color: 'bg-secondary-100 text-secondary-700' },
                  ].map((stat) => {
                    const Icon = stat.icon;
                    return (
                      <div key={stat.label} className="card p-5">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-xs text-slate-500 uppercase tracking-wide">{stat.label}</p>
                            <p className="text-2xl font-bold text-slate-900 mt-2">{stat.value}</p>
                          </div>
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="grid lg:grid-cols-2 gap-6">
                  <div className="card p-6">
                    <h3 className="font-bold text-slate-900 mb-4">Recent Registrations</h3>
                    <div className="space-y-3">
                      {indigenes.slice(0, 5).map((i) => (
                        <div key={i.id} className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-xs font-bold">
                            {getInitials(i.full_name)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900 truncate">{i.full_name}</p>
                            <p className="text-xs text-slate-400">{i.wards?.name || '—'} • {formatDate(i.created_at)}</p>
                          </div>
                          {i.verified && <BadgeCheck className="w-4 h-4 text-primary-600" />}
                          {i.flagged && <Flag className="w-4 h-4 text-error-500" />}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="card p-6">
                    <h3 className="font-bold text-slate-900 mb-4">Project Status Summary</h3>
                    <div className="space-y-3">
                      {['proposed', 'planning', 'ongoing', 'completed'].map((status) => {
                        const count = projects.filter((p) => p.status === status).length;
                        const info = getStatusInfo(status);
                        return (
                          <div key={status} className="flex items-center justify-between">
                            <span className={`badge ${info.color}`}>{info.label}</span>
                            <span className="text-sm font-bold text-slate-700">{count}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* User Verification */}
            {tab === 'users' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold text-slate-900">User Verification</h1>
                  <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search by name or phone..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="input pl-10 w-64"
                    />
                  </div>
                </div>
                <div className="card overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100">
                          <th className="text-left px-4 py-3 font-semibold text-slate-600">Name</th>
                          <th className="text-left px-4 py-3 font-semibold text-slate-600 hidden sm:table-cell">Phone</th>
                          <th className="text-left px-4 py-3 font-semibold text-slate-600 hidden md:table-cell">Ward</th>
                          <th className="text-left px-4 py-3 font-semibold text-slate-600 hidden lg:table-cell">Profession</th>
                          <th className="text-center px-4 py-3 font-semibold text-slate-600">Status</th>
                          <th className="text-right px-4 py-3 font-semibold text-slate-600">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredIndigenes.map((i) => (
                          <tr key={i.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-xs font-bold shrink-0">
                                  {getInitials(i.full_name)}
                                </div>
                                <div>
                                  <p className="font-medium text-slate-900">{i.full_name}</p>
                                  <p className="text-xs text-slate-400 sm:hidden">{i.phone}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-slate-600 hidden sm:table-cell">{i.phone}</td>
                            <td className="px-4 py-3 text-slate-600 hidden md:table-cell">{i.wards?.name || '—'}</td>
                            <td className="px-4 py-3 text-slate-600 hidden lg:table-cell">{i.profession_title || '—'}</td>
                            <td className="px-4 py-3 text-center">
                              <div className="flex items-center justify-center gap-1.5">
                                {i.verified && <span className="badge bg-success-100 text-success-700"><BadgeCheck className="w-3 h-3" /> Verified</span>}
                                {i.flagged && <span className="badge bg-error-100 text-error-600"><Flag className="w-3 h-3" /> Flagged</span>}
                                {!i.verified && !i.flagged && <span className="badge bg-slate-100 text-slate-500">Pending</span>}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center justify-end gap-1.5">
                                {updating === i.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                                ) : (
                                  <>
                                    {!i.verified && (
                                      <button
                                        onClick={() => updateIndigene(i.id, 'verified', true)}
                                        className="p-1.5 rounded-lg bg-success-50 text-success-600 hover:bg-success-100 transition-colors"
                                        title="Verify"
                                      >
                                        <Check className="w-4 h-4" />
                                      </button>
                                    )}
                                    {i.verified && (
                                      <button
                                        onClick={() => updateIndigene(i.id, 'verified', false)}
                                        className="p-1.5 rounded-lg bg-slate-50 text-slate-500 hover:bg-slate-100 transition-colors"
                                        title="Unverify"
                                      >
                                        <X className="w-4 h-4" />
                                      </button>
                                    )}
                                    <button
                                      onClick={() => updateIndigene(i.id, 'flagged', !i.flagged)}
                                      className={`p-1.5 rounded-lg transition-colors ${
                                        i.flagged
                                          ? 'bg-error-100 text-error-600 hover:bg-error-200'
                                          : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                                      }`}
                                      title={i.flagged ? 'Unflag' : 'Flag'}
                                    >
                                      <Flag className="w-4 h-4" />
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* News CMS */}
            {tab === 'news' && (
              <div className="space-y-4">
                <h1 className="text-2xl font-bold text-slate-900">News Articles</h1>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {news.map((article) => (
                    <div key={article.id} className="card p-5">
                      <span className="badge bg-primary-50 text-primary-700 mb-2">{article.category}</span>
                      <h3 className="font-semibold text-slate-900 mb-1">{article.title}</h3>
                      <p className="text-xs text-slate-400">{formatDate(article.created_at)}</p>
                      <p className="text-sm text-slate-500 mt-2 line-clamp-2">{article.excerpt}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects CMS */}
            {tab === 'projects' && (
              <div className="space-y-4">
                <h1 className="text-2xl font-bold text-slate-900">Projects</h1>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {projects.map((p) => (
                    <div key={p.id} className="card p-5">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-semibold text-slate-900">{p.title}</h3>
                        <StatusBadge status={p.status} />
                      </div>
                      <p className="text-sm text-slate-500 mb-3 line-clamp-2">{p.description}</p>
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span>{p.location || '—'}</span>
                        <span className="font-semibold text-primary-600">{p.progress}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Analytics */}
            {tab === 'analytics' && (
              <div className="space-y-6">
                <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
                {/* Ward Distribution - Bar Chart */}
                <div className="card p-6">
                  <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary-600" /> Indigenes by Ward
                  </h3>
                  <div className="space-y-3">
                    {wardData.map(([name, count]) => (
                      <div key={name} className="flex items-center gap-3">
                        <span className="text-sm text-slate-600 w-24 shrink-0">{name}</span>
                        <div className="flex-1 h-7 bg-slate-100 rounded-lg overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-primary-600 to-primary-500 rounded-lg flex items-center justify-end px-2 transition-all duration-700"
                            style={{ width: `${(count / maxWardCount) * 100}%` }}
                          >
                            <span className="text-xs font-bold text-white">{count}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                  {/* Education Distribution - Pie-style */}
                  <div className="card p-6">
                    <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <Award className="w-4 h-4 text-primary-600" /> Educational Distribution
                    </h3>
                    <div className="space-y-2">
                      {eduData.map(([qual, count], idx) => {
                        const total = indigenes.length || 1;
                        const pct = (count / total) * 100;
                        const colors = ['bg-primary-600', 'bg-secondary-600', 'bg-accent-600', 'bg-success-600', 'bg-error-500', 'bg-slate-400', 'bg-primary-400', 'bg-secondary-400'];
                        return (
                          <div key={qual} className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${colors[idx % colors.length]}`} />
                            <span className="text-sm text-slate-600 flex-1">{qual}</span>
                            <span className="text-sm font-bold text-slate-700">{count}</span>
                            <span className="text-xs text-slate-400 w-12 text-right">{pct.toFixed(0)}%</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Employment Status - Horizontal Bar */}
                  <div className="card p-6">
                    <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-primary-600" /> Employment Status & Skill Gaps
                    </h3>
                    <div className="space-y-3">
                      {empData.map(([status, count]) => (
                        <div key={status} className="flex items-center gap-3">
                          <span className="text-sm text-slate-600 w-28 shrink-0">{status}</span>
                          <div className="flex-1 h-7 bg-slate-100 rounded-lg overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-secondary-600 to-secondary-500 rounded-lg flex items-center justify-end px-2 transition-all duration-700"
                              style={{ width: `${(count / maxEmpCount) * 100}%` }}
                            >
                              <span className="text-xs font-bold text-white">{count}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Reports */}
            {tab === 'reports' && (
              <div className="space-y-4">
                <h1 className="text-2xl font-bold text-slate-900">Reports</h1>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { label: 'Indigenes Report', desc: 'Full list of registered indigenes', icon: Users },
                    { label: 'Projects Report', desc: 'Status of all community projects', icon: FolderKanban },
                    { label: 'Ward Distribution', desc: 'Indigenes by ward', icon: MapPin },
                    { label: 'Skills Report', desc: 'Skills and qualifications summary', icon: Award },
                    { label: 'News Report', desc: 'Published articles summary', icon: Newspaper },
                    { label: 'Audit Report', desc: 'System activity logs', icon: FileText },
                  ].map((r) => {
                    const Icon = r.icon;
                    return (
                      <div key={r.label} className="card card-hover p-5">
                        <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center mb-3">
                          <Icon className="w-5 h-5 text-primary-700" />
                        </div>
                        <h3 className="font-semibold text-slate-900 mb-1">{r.label}</h3>
                        <p className="text-xs text-slate-500 mb-3">{r.desc}</p>
                        <div className="flex gap-2">
                          <button className="btn-ghost text-xs px-3 py-1.5">CSV</button>
                          <button className="btn-ghost text-xs px-3 py-1.5">PDF</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Audit Logs */}
            {tab === 'audit' && (
              <div className="space-y-4">
                <h1 className="text-2xl font-bold text-slate-900">Audit Logs</h1>
                <div className="card p-6">
                  <p className="text-sm text-slate-500 text-center py-8">
                    Audit logging is active. Recent system activities will appear here.
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
