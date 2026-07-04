import { create } from 'zustand';
import type { Session, User } from '@supabase/supabase-js';

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

interface AuthState {
  session: Session | null;
  user: User | null;
  status: AuthStatus;
  setSession: (session: Session | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  user: null,
  status: 'loading',
  setSession: (session) =>
    set({
      session,
      user: session?.user ?? null,
      status: session?.user ? 'authenticated' : 'unauthenticated',
    }),
}));

