import { useState, useEffect } from 'react';
import { Menu, X, LogOut } from 'lucide-react';
import { Link, useRouter } from '@/lib/router';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import Logo from '@/components/Logo';

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'News', to: '/news' },
  { label: 'Sectors', to: '/sectors' },
  { label: 'Directory', to: '/directory' },
  { label: 'Projects', to: '/projects' },
  { label: 'Opportunities', to: '/opportunities' },
];

export default function Navbar() {
  const { route, navigate } = useRouter();
  const { user, isAdmin } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [route]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-soft border-b border-slate-100'
            : 'bg-white/80 backdrop-blur-sm'
        }`}
      >
        <nav className="container-max section-padding h-[4.5rem] flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="shrink-0">
            <Logo />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  route === link.to
                    ? 'text-primary-700 bg-primary-50'
                    : 'text-slate-600 hover:text-primary-700 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTAs */}
          <div className="hidden lg:flex items-center gap-2 shrink-0">
            {user && isAdmin ? (
              <>
                <button
                  onClick={() => navigate('/admin')}
                  className="btn-outline"
                >
                  Admin Dashboard
                </button>
                <button
                  onClick={() => { supabase.auth.signOut(); navigate('/'); }}
                  className="btn-ghost"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="btn-outline"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="btn-primary"
                >
                  Register as Indigene
                </button>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-700"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </nav>
      </header>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-fade-in"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-72 max-w-[80vw] bg-white shadow-xl animate-slide-in flex flex-col">
            <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100">
              <span className="font-display font-bold text-slate-900">Menu</span>
              <button onClick={() => setMobileOpen(false)} className="p-2 rounded-lg hover:bg-slate-100">
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto py-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`block px-6 py-3 text-sm font-medium transition-colors ${
                    route === link.to
                      ? 'text-primary-700 bg-primary-50 border-l-4 border-primary-600'
                      : 'text-slate-600 hover:bg-slate-50 border-l-4 border-transparent'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="p-4 border-t border-slate-100 space-y-2">
              {user && isAdmin ? (
                <>
                  <button onClick={() => navigate('/admin')} className="btn-outline w-full">
                    Admin Dashboard
                  </button>
                  <button onClick={() => { supabase.auth.signOut(); navigate('/'); }} className="btn-ghost w-full">
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => navigate('/login')} className="btn-outline w-full">
                    Admin Login
                  </button>
                  <button onClick={() => navigate('/register')} className="btn-primary w-full">
                    Register as Indigene
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 shadow-lg">
        <div className="flex items-center justify-around h-14">
          {NAV_LINKS.slice(0, 5).map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full text-[10px] font-medium transition-colors ${
                route === link.to ? 'text-primary-600' : 'text-slate-400'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
