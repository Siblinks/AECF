import { Briefcase, Users, GraduationCap, Heart, ArrowRight, MapPin } from 'lucide-react';
import { Link } from '@/lib/router';

const OPPORTUNITIES = [
  {
    title: 'ICT Youth Training Program',
    description: 'Free 12-week digital skills training for 200 youth. Learn web development, digital marketing, and data analysis.',
    category: 'Training',
    location: 'Agaie Town',
    deadline: 'Ongoing',
    icon: GraduationCap,
    color: 'bg-secondary-100 text-secondary-700',
  },
  {
    title: 'Agricultural Cooperative Training',
    description: 'Modern farming techniques training for farmers. Includes improved seed varieties and agribusiness fundamentals.',
    category: 'Agriculture',
    location: 'Multiple Wards',
    deadline: 'Rolling Intake',
    icon: Briefcase,
    color: 'bg-primary-100 text-primary-700',
  },
  {
    title: 'ALGC Forum Scholarship Scheme 2026',
    description: 'Scholarships covering tuition and books for 50 students from indigent families across all 10 wards.',
    category: 'Scholarship',
    location: 'All Wards',
    deadline: 'Open',
    icon: GraduationCap,
    color: 'bg-accent-100 text-accent-700',
  },
  {
    title: 'Health Outreach Volunteers',
    description: 'Medical professionals needed for quarterly free health screening across all wards of Agaie LGA.',
    category: 'Volunteer',
    location: 'All Wards',
    deadline: 'Ongoing',
    icon: Heart,
    color: 'bg-error-100 text-error-600',
  },
  {
    title: 'SME Development Workshop',
    description: 'Business development and microfinance training for 100 small business owners in Bida district.',
    category: 'Business',
    location: 'Bida District',
    deadline: 'March 2026',
    icon: Briefcase,
    color: 'bg-accent-100 text-accent-700',
  },
  {
    title: 'Community Environmental Cleanup',
    description: 'Join community volunteers for environmental conservation and tree planting drives across Agaie LGA.',
    category: 'Volunteer',
    location: 'All Wards',
    deadline: 'Monthly',
    icon: Users,
    color: 'bg-primary-100 text-primary-700',
  },
];

export default function Opportunities() {
  return (
    <div className="pt-16">
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 py-16 lg:py-20">
        <div className="container-max section-padding">
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3">Opportunities</h1>
          <p className="text-white/70 text-lg max-w-2xl">
            Training programs, scholarships, volunteer opportunities, and initiatives available to indigenes of Agaie LGA.
          </p>
        </div>
      </section>

      <section className="container-max section-padding py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {OPPORTUNITIES.map((opp) => {
            const Icon = opp.icon;
            return (
              <div key={opp.title} className="card card-hover p-6 flex flex-col">
                <div className={`w-12 h-12 rounded-xl ${opp.color} flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className="badge bg-slate-100 text-slate-600 self-start mb-3">{opp.category}</span>
                <h3 className="font-bold text-slate-900 text-lg mb-2">{opp.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed flex-1">{opp.description}</p>
                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-slate-100 text-xs text-slate-400">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {opp.location}</span>
                  <span>•</span>
                  <span>{opp.deadline}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="card p-8 lg:p-12 text-center bg-gradient-to-br from-primary-50 to-white border-primary-100 mt-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Don't Miss Out</h2>
          <p className="text-slate-600 max-w-xl mx-auto mb-6">
            Register as an indigene to get notified about new opportunities and programs tailored to your skills and interests.
          </p>
          <Link to="/register" className="btn-primary text-base px-7 py-3.5">
            Register Now <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
