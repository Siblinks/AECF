import { useEffect, useState } from 'react';
import { ArrowRight, FolderKanban } from 'lucide-react';
import { Link, useRouter } from '@/lib/router';
import { PILLARS } from '@/lib/constants';
import { supabase } from '@/lib/supabase';
import type { Project } from '@/lib/types';

export default function Sectors() {
  return (
    <div className="pt-16">
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 py-16 lg:py-20">
        <div className="container-max section-padding">
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3">Development Sectors</h1>
          <p className="text-white/70 text-lg max-w-2xl">
            Explore our seven development pillars — the framework driving progress across every area of community life in Agaie LGA.
          </p>
        </div>
      </section>

      <section className="container-max section-padding py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <Link key={pillar.key} to={`/sectors/${pillar.key.toLowerCase()}`} className="card card-hover p-7 group">
                <div className={`w-14 h-14 rounded-2xl ${pillar.bgColor} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-7 h-7 ${pillar.textColor}`} strokeWidth={2} />
                </div>
                <h3 className="font-bold text-slate-900 text-xl mb-2">{pillar.name}</h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-4">{pillar.description}</p>
                <span className={`inline-flex items-center gap-1 text-sm font-semibold ${pillar.textColor} group-hover:gap-2 transition-all`}>
                  Explore Pillar <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export function SectorDetail({ sectorKey }: { sectorKey: string }) {
  const { navigate } = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const pillar = PILLARS.find((p) => p.key.toLowerCase() === sectorKey);

  useEffect(() => {
    if (!pillar) return;
    async function fetchProjects() {
      const { data } = await supabase
        .from('projects')
        .select('*')
        .eq('sector', pillar!.key)
        .order('created_at', { ascending: false });
      setProjects(data || []);
      setLoading(false);
    }
    fetchProjects();
  }, [sectorKey]);

  if (!pillar) {
    return (
      <div className="pt-16 container-max section-padding py-20 text-center">
        <h2 className="text-xl font-bold text-slate-900 mb-2">Sector not found</h2>
        <button onClick={() => navigate('/sectors')} className="btn-primary mt-4">View All Sectors</button>
      </div>
    );
  }

  const Icon = pillar.icon;

  return (
    <div className="pt-16">
      <section className={`bg-gradient-to-br ${pillar.textColor.includes('primary') ? 'from-primary-600 to-primary-800' : pillar.textColor.includes('secondary') ? 'from-secondary-700 to-secondary-900' : pillar.textColor.includes('accent') ? 'from-accent-600 to-accent-800' : 'from-slate-700 to-slate-800'} py-16 lg:py-20`}>
        <div className="container-max section-padding">
          <Link to="/sectors" className="inline-flex items-center gap-1.5 text-sm text-white/70 hover:text-white mb-4">
            ← All Sectors
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Icon className="w-8 h-8 text-white" strokeWidth={2} />
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-white">{pillar.name}</h1>
          </div>
          <p className="text-white/70 text-lg max-w-2xl">{pillar.description}</p>
        </div>
      </section>

      <section className="container-max section-padding py-12">
        <h2 className="text-xl font-bold text-slate-900 mb-6">Projects in this Sector</h2>
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="card p-6">
                <div className="skeleton h-5 w-3/4 mb-3" />
                <div className="skeleton h-4 w-full mb-2" />
                <div className="skeleton h-4 w-2/3" />
              </div>
            ))}
          </div>
        ) : projects.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Link key={project.id} to={`/projects/${project.id}`} className="card card-hover p-6 group">
                <h3 className="font-bold text-slate-900 mb-2 group-hover:text-primary-700 transition-colors">{project.title}</h3>
                <p className="text-sm text-slate-500 mb-4">{project.description}</p>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>{project.location || '—'}</span>
                  <span className="font-semibold text-primary-600">{project.progress}%</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <FolderKanban className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-400">No projects in this sector yet.</p>
          </div>
        )}
      </section>
    </div>
  );
}
