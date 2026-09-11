import { useEffect, useState } from 'react';
import { Check, ChevronRight, ChevronLeft, User, GraduationCap, Briefcase, Wrench, ShieldCheck, Loader2, PartyPopper } from 'lucide-react';
import { useRouter } from '@/lib/router';
import { supabase } from '@/lib/supabase';
import type { Ward } from '@/lib/types';
import { QUALIFICATIONS, FIELDS_OF_STUDY, EMPLOYMENT_STATUSES, SKILL_OPTIONS, VOLUNTEER_AREAS } from '@/lib/constants';

const STEPS = [
  { label: 'Identity', icon: User },
  { label: 'Education', icon: GraduationCap },
  { label: 'Occupation', icon: Briefcase },
  { label: 'Skills', icon: Wrench },
  { label: 'Privacy', icon: ShieldCheck },
];

interface FormData {
  full_name: string;
  phone: string;
  email: string;
  ward_id: string;
  qualification: string;
  field_of_study: string;
  discipline: string;
  employment_status: string;
  company: string;
  profession_title: string;
  skills: string[];
  volunteer_areas: string[];
  in_public_directory: boolean;
}

const INITIAL: FormData = {
  full_name: '',
  phone: '+234 ',
  email: '',
  ward_id: '',
  qualification: '',
  field_of_study: '',
  discipline: '',
  employment_status: '',
  company: '',
  profession_title: '',
  skills: [],
  volunteer_areas: [],
  in_public_directory: true,
};

export default function Register() {
  const { navigate } = useRouter();
  const [step, setStep] = useState(0);
  const [wards, setWards] = useState<Ward[]>([]);
  const [data, setData] = useState<FormData>(INITIAL);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    supabase.from('wards').select('*').order('name').then(({ data }) => setWards(data || []));
  }, []);

  function update(field: keyof FormData, value: string | string[] | boolean) {
    setData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  }

  function toggleArray(field: 'skills' | 'volunteer_areas', value: string) {
    setData((prev) => {
      const arr = prev[field];
      return { ...prev, [field]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value] };
    });
  }

  function validateStep(): boolean {
    const errs: Record<string, string> = {};
    if (step === 0) {
      if (!data.full_name.trim()) errs.full_name = 'Full name is required';
      if (!data.phone.trim() || data.phone.trim().length < 7) errs.phone = 'Valid phone number is required';
      if (!data.ward_id) errs.ward_id = 'Please select your ward';
    }
    if (step === 1) {
      if (!data.qualification) errs.qualification = 'Please select your qualification';
      if (!data.field_of_study) errs.field_of_study = 'Please select your field of study';
    }
    if (step === 2) {
      if (!data.employment_status) errs.employment_status = 'Please select your employment status';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function next() {
    if (!validateStep()) return;
    if (step < STEPS.length - 1) setStep(step + 1);
  }

  function back() {
    if (step > 0) setStep(step - 1);
  }

  async function submit() {
    if (!validateStep()) return;
    setSubmitting(true);
    const { error } = await supabase.from('indigenes').insert({
      full_name: data.full_name,
      phone: data.phone,
      email: data.email || null,
      ward_id: data.ward_id || null,
      qualification: data.qualification || null,
      field_of_study: data.field_of_study || null,
      discipline: data.discipline || null,
      employment_status: data.employment_status || null,
      company: data.company || null,
      profession_title: data.profession_title || null,
      skills: data.skills,
      volunteer_areas: data.volunteer_areas,
      in_public_directory: data.in_public_directory,
    });
    setSubmitting(false);
    if (error) {
      setErrors({ submit: error.message });
    } else {
      setSuccess(true);
    }
  }

  if (success) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center section-padding">
        <div className="card p-8 lg:p-12 max-w-lg text-center animate-scale-in">
          <div className="w-16 h-16 rounded-2xl bg-success-100 flex items-center justify-center mx-auto mb-6">
            <PartyPopper className="w-8 h-8 text-success-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Registration Successful!</h2>
          <p className="text-slate-600 mb-6">
            Welcome to the ALGC Forum, {data.full_name.split(' ')[0]}! Your registration has been received.
            Our team will verify your details and you'll appear in the directory soon.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={() => navigate('/directory')} className="btn-primary">View Directory</button>
            <button onClick={() => navigate('/')} className="btn-outline">Go Home</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-slate-50">
      <div className="container-max section-padding py-10">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">Register as an Indigene</h1>
            <p className="text-slate-500 mt-2">Join the ALGC Forum community. It takes less than 5 minutes.</p>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center justify-between mb-8 px-2">
            {STEPS.map((s, idx) => {
              const Icon = s.icon;
              const isComplete = idx < step;
              const isActive = idx === step;
              return (
                <div key={idx} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center gap-1.5">
                    <div
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-all ${
                        isComplete
                          ? 'bg-primary-600 text-white'
                          : isActive
                          ? 'bg-primary-600 text-white ring-4 ring-primary-100'
                          : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {isComplete ? <Check className="w-5 h-5" /> : <Icon className="w-4 h-4 sm:w-5 sm:h-5" />}
                    </div>
                    <span className={`text-[10px] sm:text-xs font-medium ${isActive ? 'text-primary-700' : isComplete ? 'text-primary-600' : 'text-slate-400'}`}>
                      {s.label}
                    </span>
                  </div>
                  {idx < STEPS.length - 1 && (
                    <div className={`h-0.5 flex-1 mx-2 sm:mx-3 rounded-full transition-colors ${isComplete ? 'bg-primary-600' : 'bg-slate-200'}`} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Form Card */}
          <div className="card p-6 lg:p-8">
            {/* Step 1: Identity */}
            {step === 0 && (
              <div className="space-y-5 animate-fade-in">
                <h2 className="text-lg font-bold text-slate-900">Identity & Location</h2>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name <span className="text-error-500">*</span></label>
                  <input
                    type="text"
                    value={data.full_name}
                    onChange={(e) => update('full_name', e.target.value)}
                    placeholder="e.g. Muhammad Abdullahi"
                    className="input"
                  />
                  {errors.full_name && <p className="text-xs text-error-600 mt-1">{errors.full_name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone Number <span className="text-error-500">*</span></label>
                  <input
                    type="tel"
                    value={data.phone}
                    onChange={(e) => update('phone', e.target.value)}
                    placeholder="+234 803 123 4567"
                    className="input"
                  />
                  {errors.phone && <p className="text-xs text-error-600 mt-1">{errors.phone}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Email (optional)</label>
                  <input
                    type="email"
                    value={data.email}
                    onChange={(e) => update('email', e.target.value)}
                    placeholder="your@email.com"
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Ward of Origin in Agaie LGA <span className="text-error-500">*</span></label>
                  <select value={data.ward_id} onChange={(e) => update('ward_id', e.target.value)} className="select">
                    <option value="">Select your ward</option>
                    {wards.map((w) => (
                      <option key={w.id} value={w.id}>{w.name} — {w.district}</option>
                    ))}
                  </select>
                  {errors.ward_id && <p className="text-xs text-error-600 mt-1">{errors.ward_id}</p>}
                </div>
              </div>
            )}

            {/* Step 2: Education */}
            {step === 1 && (
              <div className="space-y-5 animate-fade-in">
                <h2 className="text-lg font-bold text-slate-900">Education & Specialization</h2>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Highest Qualification <span className="text-error-500">*</span></label>
                  <select value={data.qualification} onChange={(e) => update('qualification', e.target.value)} className="select">
                    <option value="">Select qualification</option>
                    {QUALIFICATIONS.map((q) => (
                      <option key={q} value={q}>{q}</option>
                    ))}
                  </select>
                  {errors.qualification && <p className="text-xs text-error-600 mt-1">{errors.qualification}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Broad Field of Study <span className="text-error-500">*</span></label>
                  <select value={data.field_of_study} onChange={(e) => update('field_of_study', e.target.value)} className="select">
                    <option value="">Select field</option>
                    {FIELDS_OF_STUDY.map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                  {errors.field_of_study && <p className="text-xs text-error-600 mt-1">{errors.field_of_study}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Specific Discipline</label>
                  <input
                    type="text"
                    value={data.discipline}
                    onChange={(e) => update('discipline', e.target.value)}
                    placeholder="e.g. Civil Engineering, Nursing, Accounting"
                    className="input"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Occupation */}
            {step === 2 && (
              <div className="space-y-5 animate-fade-in">
                <h2 className="text-lg font-bold text-slate-900">Occupation & Employment</h2>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Employment Status <span className="text-error-500">*</span></label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {EMPLOYMENT_STATUSES.map((status) => (
                      <button
                        key={status}
                        type="button"
                        onClick={() => update('employment_status', status)}
                        className={`px-4 py-2.5 rounded-xl text-sm font-medium border-2 transition-all ${
                          data.employment_status === status
                            ? 'border-primary-600 bg-primary-50 text-primary-700'
                            : 'border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                  {errors.employment_status && <p className="text-xs text-error-600 mt-1">{errors.employment_status}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Company / Institution</label>
                  <input
                    type="text"
                    value={data.company}
                    onChange={(e) => update('company', e.target.value)}
                    placeholder="e.g. Niger State Ministry of Works"
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Professional Title</label>
                  <input
                    type="text"
                    value={data.profession_title}
                    onChange={(e) => update('profession_title', e.target.value)}
                    placeholder="e.g. Civil Engineer, Medical Doctor"
                    className="input"
                  />
                  <p className="text-xs text-slate-400 mt-1">This will appear in the public directory if you opt in.</p>
                </div>
              </div>
            )}

            {/* Step 4: Skills */}
            {step === 3 && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 mb-1">Skills & Expertise</h2>
                  <p className="text-sm text-slate-500 mb-4">Select all that apply to you.</p>
                  <div className="flex flex-wrap gap-2">
                    {SKILL_OPTIONS.map((skill) => (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => toggleArray('skills', skill)}
                        className={`px-3.5 py-2 rounded-xl text-sm font-medium border-2 transition-all ${
                          data.skills.includes(skill)
                            ? 'border-primary-600 bg-primary-50 text-primary-700'
                            : 'border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-1">Voluntary Contributions</h3>
                  <p className="text-sm text-slate-500 mb-4">Areas you'd like to volunteer in the community.</p>
                  <div className="flex flex-wrap gap-2">
                    {VOLUNTEER_AREAS.map((area) => (
                      <button
                        key={area}
                        type="button"
                        onClick={() => toggleArray('volunteer_areas', area)}
                        className={`px-3.5 py-2 rounded-xl text-sm font-medium border-2 transition-all ${
                          data.volunteer_areas.includes(area)
                            ? 'border-accent-600 bg-accent-50 text-accent-700'
                            : 'border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        {area}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Privacy */}
            {step === 4 && (
              <div className="space-y-5 animate-fade-in">
                <h2 className="text-lg font-bold text-slate-900">Privacy Settings & Verification</h2>
                <div className="card p-5 bg-slate-50 border-slate-100">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-5 h-5 text-primary-700" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 text-sm">Data Consent</h3>
                      <p className="text-xs text-slate-500 mt-1">
                        Your phone number and email are never shown publicly. Only your name, profession, ward, and skills
                        will appear in the directory if you opt in below.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="card p-5">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={data.in_public_directory}
                      onChange={(e) => update('in_public_directory', e.target.checked)}
                      className="mt-0.5 w-5 h-5 rounded border-slate-300 text-primary-600 focus:ring-primary-600"
                    />
                    <div>
                      <span className="font-medium text-slate-900 text-sm block">Include me in the Public Professional Directory</span>
                      <span className="text-xs text-slate-500">Allow other indigenes to find and connect with you. You can change this anytime.</span>
                    </div>
                  </label>
                </div>
                <div className="card p-5 bg-primary-50 border-primary-100">
                  <p className="text-sm text-primary-800">
                    By submitting, you confirm that the information provided is accurate and you are an indigene of Agaie LGA.
                    Your registration will be reviewed by our team before verification.
                  </p>
                </div>
                {errors.submit && <p className="text-sm text-error-600">{errors.submit}</p>}
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100">
              <button
                onClick={back}
                disabled={step === 0}
                className="btn-ghost"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              {step < STEPS.length - 1 ? (
                <button onClick={next} className="btn-primary">
                  Continue <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button onClick={submit} disabled={submitting} className="btn-primary">
                  {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</> : <><Check className="w-4 h-4" /> Submit Registration</>}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
