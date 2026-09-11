import { useEffect, useState, useMemo } from 'react';
import { Search, Users, MapPin, Award, Briefcase, X, BadgeCheck, Filter } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { PublicIndigeneWithWard, Ward } from '@/lib/types';
import { QUALIFICATIONS, FIELDS_OF_STUDY } from '@/lib/constants';
import { getInitials } from '@/lib/format';

export default function Directory() {
  const [indigenes, setIndigenes] = useState<PublicIndigeneWithWard[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [wardFilter, setWardFilter] = useState('all');
  const [fieldFilter, setFieldFilter] = useState('all');
  const [skillFilter, setSkillFilter] = useState('all');
  const [selected, setSelected] = useState<PublicIndigeneWithWard | null>(null);

  useEffect(() => {
    async function fetchData() {
      const [indRes, wardsRes] = await Promise.all([
        supabase.from('public_indigenes').select('*, wards(*)').order('created_at', { ascending: false }),
        supabase.from('wards').select('*').order('name'),
      ]);
      setIndigenes((indRes.data || []) as PublicIndigeneWithWard[]);
      setWards(wardsRes.data || []);
      setLoading(false);
    }
    fetchData();
  }, []);

  const allSkills = useMemo(() => {
    const skills = new Set<string>();
    indigenes.forEach((i) => i.skills?.forEach((s) => skills.add(s)));
    return Array.from(skills).sort();
  }, [indigenes]);

  const filtered = indigenes.filter((i) => {
    const matchesSearch = !search || i.full_name.toLowerCase().includes(search.toLowerCase()) || (i.profession_title || '').toLowerCase().includes(search.toLowerCase());
    const matchesWard = wardFilter === 'all' || i.ward_id === wardFilter;
    const matchesField = fieldFilter === 'all' || i.industry === fieldFilter;
    const matchesSkill = skillFilter === 'all' || (i.skills || []).includes(skillFilter);
    return matchesSearch && matchesWard && matchesField && matchesSkill;
  });

  return (
    <div className="pt-16">
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 py-16 lg:py-20">
        <div className="container-max section-padding">
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3">Professional Directory</h1>
          <p className="text-white/70 text-lg max-w-2xl">
            Connect with skilled indigenes of Agaie LGA. Search by name, ward, industry, or skill to find the right professional.
          </p>
        </div>
      </section>

      <section className="container-max section-padding py-10">
        {/* Search & Filters */}
        <div className="space-y-4 mb-8">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or profession..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input pl-10"
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Filter className="w-4 h-4" /> Filters:
            </div>
            <select value={wardFilter} onChange={(e) => setWardFilter(e.target.value)} className="select flex-1 min-w-[140px]">
              <option value="all">All Wards</option>
              {wards.map((w) => (
                <option key={w.id} value={w.id}>{w.name}</option>
              ))}
            </select>
            <select value={fieldFilter} onChange={(e) => setFieldFilter(e.target.value)} className="select flex-1 min-w-[140px]">
              <option value="all">All Industries</option>
              {FIELDS_OF_STUDY.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
            <select value={skillFilter} onChange={(e) => setSkillFilter(e.target.value)} className="select flex-1 min-w-[140px]">
              <option value="all">All Skills</option>
              {allSkills.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <p className="text-sm text-slate-500">{filtered.length} {filtered.length === 1 ? 'professional' : 'professionals'} found</p>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="skeleton w-14 h-14 rounded-full" />
                  <div className="flex-1">
                    <div className="skeleton h-4 w-2/3 mb-2" />
                    <div className="skeleton h-3 w-1/2" />
                  </div>
                </div>
                <div className="skeleton h-4 w-full mb-2" />
                <div className="skeleton h-4 w-2/3" />
              </div>
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((indigene) => (
              <button
                key={indigene.id}
                onClick={() => setSelected(indigene)}
                className="card card-hover p-6 text-left group"
              >
                <div className="flex items-start gap-4 mb-4">
                  {indigene.avatar_url ? (
                    <img src={indigene.avatar_url} alt={indigene.full_name} className="w-14 h-14 rounded-full object-cover" />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center text-primary-700 font-bold text-lg">
                      {getInitials(indigene.full_name)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-bold text-slate-900 group-hover:text-primary-700 transition-colors truncate">{indigene.full_name}</h3>
                      {indigene.verified && <BadgeCheck className="w-4 h-4 text-primary-600 shrink-0" />}
                    </div>
                    <p className="text-sm text-slate-500 truncate">{indigene.profession_title || '—'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-400 mb-3">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {indigene.wards?.name || '—'}</span>
                  <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" /> {indigene.industry || '—'}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(indigene.skills || []).slice(0, 3).map((skill) => (
                    <span key={skill} className="badge bg-slate-100 text-slate-600">{skill}</span>
                  ))}
                  {(indigene.skills || []).length > 3 && (
                    <span className="badge bg-slate-100 text-slate-500">+{(indigene.skills || []).length - 3}</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-400">No professionals found matching your filters.</p>
          </div>
        )}
      </section>

      {/* Profile Drawer */}
      {selected && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-fade-in" onClick={() => setSelected(null)} />
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-xl animate-slide-in flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <h3 className="font-bold text-slate-900">Public Profile</h3>
              <button onClick={() => setSelected(null)} className="p-2 rounded-lg hover:bg-slate-100">
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="flex flex-col items-center text-center mb-6">
                {selected.avatar_url ? (
                  <img src={selected.avatar_url} alt={selected.full_name} className="w-24 h-24 rounded-full object-cover mb-4" />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center text-primary-700 font-bold text-3xl mb-4">
                    {getInitials(selected.full_name)}
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-slate-900">{selected.full_name}</h2>
                  {selected.verified && <BadgeCheck className="w-5 h-5 text-primary-600" />}
                </div>
                <p className="text-slate-500">{selected.profession_title || '—'}</p>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Ward of Origin</p>
                  <p className="text-sm text-slate-700 flex items-center gap-2"><MapPin className="w-4 h-4 text-slate-400" /> {selected.wards?.name || '—'}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Industry</p>
                  <p className="text-sm text-slate-700 flex items-center gap-2"><Briefcase className="w-4 h-4 text-slate-400" /> {selected.industry || '—'}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {(selected.skills || []).map((skill) => (
                      <span key={skill} className="badge bg-primary-50 text-primary-700">{skill}</span>
                    ))}
                  </div>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 text-center">
                  <p className="text-xs text-slate-500">
                    Contact details are protected. Phone numbers and emails are only shared with explicit consent from the indigene.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
