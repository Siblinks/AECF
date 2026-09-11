import { useEffect, useState } from 'react';
import { Users, Award, MapPin, FolderKanban, ArrowRight, TrendingUp, Newspaper, ChevronRight } from 'lucide-react';
import { Link } from '@/lib/router';
import { supabase } from '@/lib/supabase';
import { PILLARS } from '@/lib/constants';
import type { NewsArticle, Project } from '@/lib/types';
import MetricCard from '@/components/MetricCard';
import ProgressBar from '@/components/ProgressBar';
import StatusBadge from '@/components/StatusBadge';
import { truncate, formatRelativeTime } from '@/lib/format';

interface Metrics {
  indigenes: number;
  professionals: number;
  wards: number;
  projects: number;
}

export default function Home() {
  const [metrics, setMetrics] = useState<Metrics>({ indigenes: 0, professionals: 0, wards: 0, projects: 0 });
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const [indRes, wardsRes, projRes, newsRes, profRes] = await Promise.all([
        supabase.from('indigenes').select('id', { count: 'exact', head: true }),
        supabase.from('wards').select('id', { count: 'exact', head: true }),
        supabase.from('projects').select('id', { count: 'exact', head: true }),
        supabase.from('news').select('*').eq('published', true).order('created_at', { ascending: false }).limit(3),
        supabase.from('indigenes').select('id', { count: 'exact', head: true }).not('profession_title', 'is', null),
      ]);

      setMetrics({
        indigenes: indRes.count || 0,
        professionals: profRes.count || 0,
        wards: wardsRes.count || 0,
        projects: projRes.count || 0,
      });
      setNews(newsRes.data || []);
      setProjects(
        (await supabase.from('projects').select('*').order('created_at', { ascending: false }).limit(3)).data || []
      );
      setLoading(false);
    }
    fetchData();
  }, []);

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/16072039/pexels-photo-16072039.jpeg?auto=compress&cs=tinysrgb&w=1600"
            alt="Aerial view of a vibrant African town surrounded by greenery"
            className="w-full h-full object-cover"
            loading="eager"
          />
        </div>
        {/* Gradient fade: dark blue on the left fading toward the image on the right, and fading out at the bottom into the page */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0D47A1] via-[#0D47A1]/85 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-[#0D47A1]/20 to-transparent" />
        {/* Subtle accent glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#1688E5]/30 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3" />
        <div className="absolute bottom-1/4 left-0 w-72 h-72 bg-[#028A38]/20 rounded-full blur-3xl" />

        <div className="container-max section-padding relative">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-16 items-center min-h-[600px] py-16 lg:py-24">
            <div className="space-y-6 animate-fade-in-up">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm font-medium">
                <span className="w-2 h-2 rounded-full bg-accent-400 animate-pulse" />
                Agaie Local Government Area, Niger State
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-[3.65rem] font-bold text-white leading-[1.08] text-balance drop-shadow-lg">
                Connecting the People of Agaie.{' '}
                <span className="text-[#F2B705]">Building Our Future Together.</span>
              </h1>
              <p className="text-lg text-white/85 leading-relaxed max-w-xl drop-shadow">
                A digital community hub for indigenes of Agaie LGA. Register, connect with skilled professionals,
                track development projects, and help shape the future of our community.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link to="/register" className="btn-accent text-base px-7 py-3.5">
                  Register as an Indigene
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/sectors" className="btn bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 text-base px-7 py-3.5">
                  Explore Sectors
                </Link>
              </div>
              <div className="flex items-center gap-6 pt-4 text-white/70 text-sm">
                <span className="flex items-center gap-1.5"><Users className="w-4 h-4" /> {metrics.indigenes}+ Registered</span>
                <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {metrics.wards} Wards</span>
              </div>
            </div>

            {/* Floating info card */}
            <div className="relative hidden lg:flex flex-col gap-4 animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
              <div className="bg-white/95 backdrop-blur-md rounded-2xl p-5 shadow-2xl border-l-4 border-[#F2B705] ml-auto max-w-sm">
                <p className="text-sm font-semibold text-slate-900">Community-Driven Development</p>
                <p className="text-xs text-slate-500 mt-1">Building infrastructure, empowering people, creating opportunities.</p>
              </div>
              <div className="bg-white rounded-2xl shadow-xl p-4 w-40 ml-auto">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 rounded-lg bg-success-100 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-success-600" />
                  </div>
                  <span className="text-xs font-medium text-slate-500">Active Projects</span>
                </div>
                <p className="text-2xl font-bold text-slate-900">{metrics.projects}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Section */}
      <section className="container-max section-padding -mt-10 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="card p-6">
                <div className="skeleton h-4 w-24 mb-3" />
                <div className="skeleton h-8 w-16" />
              </div>
            ))
          ) : (
            <>
              <MetricCard label="Registered Indigenes" value={metrics.indigenes} icon={Users} color="bg-primary-100 text-primary-700" suffix="+" />
              <MetricCard label="Skilled Professionals" value={metrics.professionals} icon={Award} color="bg-secondary-100 text-secondary-700" suffix="+" />
              <MetricCard label="Active Wards" value={metrics.wards} icon={MapPin} color="bg-accent-100 text-accent-700" />
              <MetricCard label="Development Projects" value={metrics.projects} icon={FolderKanban} color="bg-success-100 text-success-700" />
            </>
          )}
        </div>
      </section>

      {/* 7 Development Pillars */}
      <section className="container-max section-padding py-16 lg:py-24">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-sm font-semibold text-primary-600 uppercase tracking-wide">Our Focus Areas</span>
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mt-2">The 7 Development Pillars</h2>
          <p className="text-slate-500 mt-4 text-lg">
            A comprehensive framework for community development across seven critical sectors.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {PILLARS.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <Link
                key={pillar.key}
                to={`/sectors/${pillar.key.toLowerCase()}`}
                className="card card-hover p-6 group animate-fade-in-up"
              >
                <div style={{ animationDelay: `${idx * 0.05}s` }}>
                  <div className={`w-12 h-12 rounded-xl ${pillar.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-6 h-6 ${pillar.textColor}`} strokeWidth={2} />
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg mb-2">{pillar.name}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{pillar.description}</p>
                  <span className={`inline-flex items-center gap-1 mt-4 text-sm font-semibold ${pillar.textColor} group-hover:gap-2 transition-all`}>
                    Explore Pillar <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            );
          })}
          {/* CTA Card */}
          <Link to="/sectors" className="card card-hover p-6 bg-gradient-to-br from-[#1688E5] to-[#0D47A1] group">
            <div className="h-full flex flex-col justify-center items-center text-center">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <ArrowRight className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-white text-lg mb-2">View All Sectors</h3>
              <p className="text-sm text-white/70">See how we're driving progress across every area.</p>
            </div>
          </Link>
        </div>
      </section>

      {/* News + Project Tracker */}
      <section className="bg-slate-50 border-y border-slate-100">
        <div className="container-max section-padding py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Latest News */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="text-sm font-semibold text-primary-600 uppercase tracking-wide">Stay Informed</span>
                  <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mt-1">Latest Updates</h2>
                </div>
                <Link to="/news" className="text-sm font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1 shrink-0">
                  View All <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="space-y-4">
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="card p-5">
                      <div className="skeleton h-4 w-20 mb-3" />
                      <div className="skeleton h-5 w-3/4 mb-2" />
                      <div className="skeleton h-4 w-full" />
                    </div>
                  ))
                ) : news.length > 0 ? (
                  news.map((article) => (
                    <Link key={article.id} to={`/news/${article.id}`} className="card card-hover p-5 block group">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center shrink-0">
                          <Newspaper className="w-5 h-5 text-primary-700" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="badge bg-primary-50 text-primary-700">{article.category}</span>
                            <span className="text-xs text-slate-400">{formatRelativeTime(article.created_at)}</span>
                          </div>
                          <h3 className="font-semibold text-slate-900 group-hover:text-primary-700 transition-colors">
                            {article.title}
                          </h3>
                          <p className="text-sm text-slate-500 mt-1 line-clamp-2">{truncate(article.excerpt, 100)}</p>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="text-slate-400 text-sm">No news articles yet.</p>
                )}
              </div>
            </div>

            {/* Project Tracker */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="text-sm font-semibold text-primary-600 uppercase tracking-wide">Track Progress</span>
                  <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mt-1">Project Tracker</h2>
                </div>
                <Link to="/projects" className="text-sm font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1 shrink-0">
                  View All <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="space-y-4">
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="card p-5">
                      <div className="skeleton h-5 w-3/4 mb-3" />
                      <div className="skeleton h-2 w-full" />
                    </div>
                  ))
                ) : projects.length > 0 ? (
                  projects.map((project) => (
                    <Link key={project.id} to={`/projects/${project.id}`} className="card card-hover p-5 block group">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <h3 className="font-semibold text-slate-900 group-hover:text-primary-700 transition-colors flex-1">
                          {project.title}
                        </h3>
                        <StatusBadge status={project.status} />
                      </div>
                      <p className="text-sm text-slate-500 mb-3 line-clamp-2">{truncate(project.description, 80)}</p>
                      <ProgressBar value={project.progress} size="sm" />
                      <div className="flex items-center gap-3 mt-3 text-xs text-slate-400">
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {project.location || '—'}</span>
                        <span>•</span>
                        <span>{project.sector}</span>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="text-slate-400 text-sm">No projects yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container-max section-padding py-16 lg:py-24">
        <div className="relative rounded-2xl bg-gradient-to-br from-[#0D47A1] to-[#061f4c] overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary-500/20 rounded-full blur-3xl" />
          <div className="relative section-padding py-12 lg:py-16 text-center">
            <h2 className="text-2xl lg:text-4xl font-bold text-white mb-4">Join the ALGC Forum Today</h2>
            <p className="text-white/70 text-lg max-w-2xl mx-auto mb-8">
              Register as an indigene and become part of a growing community working together
              to build a brighter future for Agaie LGA.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/register" className="btn-accent text-base px-7 py-3.5">
                Register Now <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/directory" className="btn bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 text-base px-7 py-3.5">
                Browse Directory
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
