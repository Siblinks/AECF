import { useState } from 'react';
import { Loader2, LogIn, AlertCircle } from 'lucide-react';
import { useRouter, Link } from '@/lib/router';
import { supabase } from '@/lib/supabase';
import Logo from '@/components/Logo';

export default function Login() {
  const { navigate } = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) {
      setError('Invalid email or password. Please try again.');
      setLoading(false);
      return;
    }

    const { data: isAdmin } = await supabase.rpc('is_current_user_admin');
    if (!isAdmin) {
      await supabase.auth.signOut();
      setError('This account does not have admin access. Only designated administrators can access the portal.');
      setLoading(false);
      return;
    }

    setLoading(false);
    navigate('/admin');
  }

  return (
    <div className="pt-16 min-h-screen flex items-center justify-center section-padding bg-slate-50">
      <div className="card p-8 w-full max-w-md animate-scale-in">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Logo size="lg" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Portal</h1>
          <p className="text-slate-500 text-sm mt-1">Sign in with your administrator account</p>
        </div>

        {error && (
          <div className="bg-error-50 border border-error-100 rounded-xl p-3 mb-4 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-error-600 mt-0.5 shrink-0" />
            <p className="text-sm text-error-700">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@algcforum.org"
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="input"
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
            Sign In
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          Not an administrator?{' '}
          <Link to="/register" className="font-semibold text-primary-600 hover:text-primary-700">
            Register as an Indigene
          </Link>
        </p>
      </div>
    </div>
  );
}
