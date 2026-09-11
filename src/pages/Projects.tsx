import { useEffect, useState } from 'react';
import { FolderKanban, MapPin, Calendar, ArrowLeft, X } from 'lucide-react';
import { Link, useRouter } from '@/lib/router';
import { supabase } from '@/lib/supabase';
import type { Project, ProjectUpdate, Ward } from '@/lib/types';
import { PILLARS, PROJECT_STATUSES } from '@/lib/constants';
import ProgressBar from '@/components/ProgressBar';
import StatusBadge from '@/components/StatusBadge';
import { formatDate, formatRelativeTime } from '@/lib/format';

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [sectorFilter, setSectorFilter] = useState('all');

  useEffect(() => {
    async function fetchProjects() {
      const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
      setProjects(data || []);
      setLoading(false);
    }
    fetchProjects();
  }, []);

  const filtered = projects.filter((p) => {
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    const matchesSector = sectorFilter === 'all' || p.sector === sectorFilter;
    return matchesStatus && matchesSector;
  });

  return (
    <div className="pt-16">
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 py-16 lg:py-20">
        <div className="container-max section-padding">
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3">Project Tracker</h1>
          <p className="text-white/70 text-lg max-w-2xl">
            Track the progress of community development projects across Agaie LGA. See what's proposed, ongoing, and completed.
          </p>
        </div>
      </section>

      <section className="container-max section-padding py-10">
        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="select flex-1 min-w-[140px]">
            <option value="all">All Statuses</option>
            {PROJECT_STATUSES.map((s) => (
              <option key={s.key} value={s.key}>{s.label}</option>
            ))}
          </select>
          <select value={sectorFilter} onChange={(e) => setSectorFilter(e.target.value)} className="select flex-1 min-w-[140px]">
            <option value="all">All Sectors</option>
            {PILLARS.map((p) => (
              <option key={p.key} value={p.key}>{p.name}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card p-6">
                <div className="skeleton h-5 w-3/4 mb-3" />
                <div className="skeleton h-4 w-full mb-2" />
                <div className="skeleton h-4 w-2/3 mb-4" />
                <div className="skeleton h-2 w-full" />
              </div>
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((project) => (
              <Link key={project.id} to={`/projects/${project.id}`} className="card card-hover p-6 group">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <h3 className="font-bold text-slate-900 group-hover:text-primary-700 transition-colors flex-1">{project.title}</h3>
                  <StatusBadge status={project.status} />
                </div>
                <p className="text-sm text-slate-500 mb-4 line-clamp-2">{project.description}</p>
                <ProgressBar value={project.progress} size="sm" />
                <div className="flex items-center gap-3 mt-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {project.location || '—'}</span>
                  <span>•</span>
                  <span>{project.sector}</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <FolderKanban className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-400">No projects found.</p>
          </div>
        )}
      </section>
    </div>
  );
}

export function ProjectDetail({ id }: { id: string }) {
  const { navigate } = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [updates, setUpdates] = useState<ProjectUpdate[]>([]);
  const [ward, setWard] = useState<Ward | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const { data: proj } = await supabase.from('projects').select('*').eq('id', id).maybeSingle();
      setProject(proj);
      if (proj) {
        const [updRes, wardRes] = await Promise.all([
          supabase.from('project_updates').select('*').eq('project_id', id).order('created_at', { ascending: false }),
          proj.ward_id ? supabase.from('wards').select('*').eq('id', proj.ward_id).maybeSingle() : Promise.resolve({ data: null }),
        ]);
        setUpdates(updRes.data || []);
        setWard(wardRes.data as Ward | null);
      }
      setLoading(false);
    }
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="pt-16 container-max section-padding py-10">
        <div className="skeleton h-8 w-3/4 mb-4" />
        <div className="skeleton h-4 w-1/3 mb-8" />
        <div className="skeleton h-4 w-full mb-2" />
        <div className="skeleton h-4 w-2/3" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="pt-16 container-max section-padding py-20 text-center">
        <FolderKanban className="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-slate-900 mb-2">Project not found</h2>
        <button onClick={() => navigate('/projects')} className="btn-primary mt-4">Back to Projects</button>
      </div>
    );
  }

  const pillar = PILLARS.find((p) => p.key === project.sector);

  return (
    <div className="pt-16">
      <article className="container-max section-padding py-10 max-w-4xl">
        <Link to="/projects" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-primary-700 mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Projects
        </Link>

        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              {pillar && <span className="badge bg-primary-50 text-primary-700">{pillar.name}</span>}
              <StatusBadge status={project.status} />
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-2">{project.title}</h1>
            <p className="text-slate-600">{project.description}</p>
          </div>
        </div>

        {/* Progress */}
        <div className="card p-6 mb-6">
          <ProgressBar value={project.progress} size="lg" />
        </div>

        {/* Details Grid */}
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          <div className="card p-5">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Location</p>
            <p className="text-sm text-slate-700 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-slate-400" />
              {project.location || '—'}
              {ward && <span className="text-slate-400">({ward.name})</span>}
            </p>
          </div>
          <div className="card p-5">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Sector</p>
            <p className="text-sm text-slate-700">{pillar?.name || project.sector}</p>
          </div>
          <div className="card p-5">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Start Date</p>
            <p className="text-sm text-slate-700 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              {formatDate(project.start_date)}
            </p>
          </div>
          <div className="card p-5">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Target Completion</p>
            <p className="text-sm text-slate-700 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              {formatDate(project.target_date)}
            </p>
          </div>
        </div>

        {/* Updates Feed */}
        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-4">Project Updates</h2>
          {updates.length > 0 ? (
            <div className="space-y-4">
              {updates.map((update, idx) => (
                <div key={update.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
                      <div className="w-3 h-3 rounded-full bg-primary-600" />
                    </div>
                    {idx < updates.length - 1 && <div className="w-0.5 flex-1 bg-slate-200 mt-2" />}
                  </div>
                  <div className="flex-1 pb-4">
                    <p className="text-xs text-slate-400 mb-1">{formatRelativeTime(update.created_at)}</p>
                    <p className="text-sm text-slate-700">{update.update_text}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400">No updates posted yet.</p>
          )}
        </div>
      </article>
    </div>
  );
}
