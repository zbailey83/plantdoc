
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';

interface AuthContextType {
  user: any | null;
  session: any | null;
  loading: boolean;
  signOut: () => Promise<void>;
  signInAsGuest: () => void;
  isGuest: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    // Check if we were previously in guest mode
    const guestStatus = localStorage.getItem('verdant_guest_mode');
    if (guestStatus === 'true') {
      setIsGuest(true);
      setUser({ id: 'guest', email: 'guest@verdant.app', full_name: 'Guest Gardener' });
      setLoading(false);
      return;
    }

    if (!isSupabaseConfigured) {
        setLoading(false);
        return;
    }

    // Check active sessions and sets the user
    (supabase.auth as any).getSession().then(({ data: { session } }: any) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for changes on auth state (logged in, signed out, etc.)
    const { data: { subscription } } = (supabase.auth as any).onAuthStateChange((_event: any, session: any) => {
      if (!isGuest) {
        setSession(session);
        setUser(session?.user ?? null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [isGuest]);

  const signOut = async () => {
    if (isGuest) {
      setIsGuest(false);
      setUser(null);
      localStorage.removeItem('verdant_guest_mode');
    } else if (isSupabaseConfigured) {
      await (supabase.auth as any).signOut();
    }
  };

  const signInAsGuest = () => {
    setIsGuest(true);
    setUser({ id: 'guest', email: 'guest@verdant.app', full_name: 'Guest Gardener' });
    localStorage.setItem('verdant_guest_mode', 'true');
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut, signInAsGuest, isGuest }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
