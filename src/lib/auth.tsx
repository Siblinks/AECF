import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface AuthState {
  session: Session | null;
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    session: null,
    user: null,
    isAdmin: false,
    loading: true,
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        checkAdminAndSet(session);
      } else {
        setState({ session: null, user: null, isAdmin: false, loading: false });
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setState((prev) => ({ ...prev, loading: true }));
        checkAdminAndSet(session);
      } else {
        setState({ session: null, user: null, isAdmin: false, loading: false });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function checkAdminAndSet(session: Session) {
    const { data } = await supabase.rpc('is_current_user_admin');
    setState({
      session,
      user: session.user,
      isAdmin: Boolean(data),
      loading: false,
    });
  }

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
