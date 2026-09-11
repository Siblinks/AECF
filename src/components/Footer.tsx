import { MapPin, Mail, Phone, Facebook, Twitter, Linkedin } from 'lucide-react';
import { Link } from '@/lib/router';
import Logo from '@/components/Logo';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-20 pb-16 lg:pb-0">
      <div className="container-max section-padding py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Logo onDark />
            <p className="text-sm text-slate-400 leading-relaxed">
              Connecting the people of Agaie. Building our future together through community engagement,
              development planning, and collective progress.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Explore</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/about" className="text-slate-400 hover:text-primary-400 transition-colors">About Us</Link></li>
              <li><Link to="/news" className="text-slate-400 hover:text-primary-400 transition-colors">News & Updates</Link></li>
              <li><Link to="/sectors" className="text-slate-400 hover:text-primary-400 transition-colors">Development Sectors</Link></li>
              <li><Link to="/directory" className="text-slate-400 hover:text-primary-400 transition-colors">Professional Directory</Link></li>
              <li><Link to="/projects" className="text-slate-400 hover:text-primary-400 transition-colors">Project Tracker</Link></li>
            </ul>
          </div>

          {/* Get Involved */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Get Involved</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/register" className="text-slate-400 hover:text-primary-400 transition-colors">Register as Indigene</Link></li>
              <li><Link to="/opportunities" className="text-slate-400 hover:text-primary-400 transition-colors">Opportunities</Link></li>
              <li><Link to="/login" className="text-slate-400 hover:text-primary-400 transition-colors">Login</Link></li>
              <li><Link to="/admin" className="text-slate-400 hover:text-primary-400 transition-colors">Admin Dashboard</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 mt-0.5 text-primary-500 shrink-0" />
                <span>Agaie Local Government Secretariat, Niger State, Nigeria</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-primary-500 shrink-0" />
                <span>+234 803 000 0000</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-primary-500 shrink-0" />
                <span>info@algcforum.org</span>
              </li>
            </ul>
            <div className="flex items-center gap-3 mt-4">
              <a href="#" className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-primary-700 flex items-center justify-center transition-colors" aria-label="Facebook">
                <Facebook className="w-4 h-4 text-slate-300" />
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-primary-700 flex items-center justify-center transition-colors" aria-label="Twitter">
                <Twitter className="w-4 h-4 text-slate-300" />
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-primary-700 flex items-center justify-center transition-colors" aria-label="LinkedIn">
                <Linkedin className="w-4 h-4 text-slate-300" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} Agaie Local Government Consultative Forum. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <a href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
