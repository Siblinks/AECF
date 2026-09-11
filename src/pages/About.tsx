import { Target, Eye, Users, Heart, Shield, Lightbulb, Award, MapPin } from 'lucide-react';
import { Link } from '@/lib/router';

const VALUES = [
  { icon: Users, title: 'Community First', desc: 'Every decision we make puts the people of Agaie at the center.' },
  { icon: Shield, title: 'Integrity', desc: 'We operate with transparency, accountability, and honesty.' },
  { icon: Lightbulb, title: 'Innovation', desc: 'We embrace modern solutions to age-old challenges.' },
  { icon: Heart, title: 'Service', desc: 'We serve with dedication, compassion, and selflessness.' },
];

export default function About() {
  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 py-20 lg:py-28">
        <div className="container-max section-padding text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm font-medium mb-6">
            About ALGC Forum
          </span>
          <h1 className="text-3xl lg:text-5xl font-bold text-white mb-6 max-w-3xl mx-auto text-balance">
            Building a stronger Agaie through unity and collective action
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            The Agaie Local Government Consultative Forum is a community-driven platform that connects indigenes,
            maps local talent, and drives sustainable development across all 10 wards of Agaie LGA.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="container-max section-padding py-16 lg:py-24">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="card p-8 border-l-4 border-l-primary-600">
            <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center mb-5">
              <Target className="w-6 h-6 text-primary-700" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-3">Our Mission</h2>
            <p className="text-slate-600 leading-relaxed">
              To create a comprehensive database of Agaie indigenes and their skills, foster collaboration
              across sectors, and drive community-led development projects that improve the quality of life
              for all residents of Agaie Local Government Area.
            </p>
          </div>
          <div className="card p-8 border-l-4 border-l-secondary-700">
            <div className="w-12 h-12 rounded-xl bg-secondary-50 flex items-center justify-center mb-5">
              <Eye className="w-6 h-6 text-secondary-700" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-3">Our Vision</h2>
            <p className="text-slate-600 leading-relaxed">
              A self-reliant, prosperous Agaie LGA where every indigene contributes to and benefits from
              sustainable development — where local talent drives local progress, and no community is left behind.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-slate-50 border-y border-slate-100">
        <div className="container-max section-padding py-16 lg:py-24">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-sm font-semibold text-primary-600 uppercase tracking-wide">What We Stand For</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mt-2">Our Core Values</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {VALUES.map((value) => {
              const Icon = value.icon;
              return (
                <div key={value.title} className="card p-6 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-7 h-7 text-primary-700" />
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">{value.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{value.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="container-max section-padding py-16 lg:py-24">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          {[
            { value: '10', label: 'Wards Covered', icon: MapPin },
            { value: '7', label: 'Development Pillars', icon: Award },
            { value: '500+', label: 'Target Indigenes', icon: Users },
            { value: '100%', label: 'Community Driven', icon: Heart },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label}>
                <Icon className="w-8 h-8 text-primary-600 mx-auto mb-3" />
                <p className="text-3xl lg:text-4xl font-bold text-slate-900">{stat.value}</p>
                <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="container-max section-padding pb-16 lg:pb-24">
        <div className="card p-8 lg:p-12 text-center bg-gradient-to-br from-primary-50 to-white border-primary-100">
          <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-4">Ready to Make a Difference?</h2>
          <p className="text-slate-600 max-w-xl mx-auto mb-6">
            Join the ALGC Forum today and help us build a stronger, more connected Agaie.
          </p>
          <Link to="/register" className="btn-primary text-base px-7 py-3.5">
            Register as an Indigene
          </Link>
        </div>
      </section>
    </div>
  );
}
