import React, { useState } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';
import { LeafIcon, AlertIcon } from './Icons';

export const LoginView: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSupabaseConfigured) return;

    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (isSignUp) {
        const { error } = await (supabase.auth as any).signUp({
          email,
          password,
        });
        if (error) throw error;
        setMessage("Check your email for the confirmation link!");
      } else {
        const { error } = await (supabase.auth as any).signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-[#ecfdf5] to-[#d1fae5]">
       <div className="mb-8 flex flex-col items-center animate-[float_4s_ease-in-out_infinite]">
        <div className="w-24 h-24 clay-card rounded-full flex items-center justify-center mb-4">
          <LeafIcon className="w-12 h-12 text-emerald-600" />
        </div>
        <h1 className="text-4xl font-bold text-slate-800 tracking-tight font-quicksand">Verdant</h1>
      </div>

      <div className="w-full max-w-sm clay-card p-8">
        {!isSupabaseConfigured ? (
          <div className="text-center">
             <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertIcon className="w-8 h-8 text-red-500" />
             </div>
             <h2 className="text-xl font-bold text-slate-800 mb-2">Setup Required</h2>
             <p className="text-slate-600 mb-4 text-sm">
               To use this app, you need to connect a Supabase database.
             </p>
             <div className="bg-slate-100 p-4 rounded-xl text-left text-xs text-slate-600 font-mono mb-4 break-all">
                REACT_APP_SUPABASE_URL<br/>
                REACT_APP_SUPABASE_ANON_KEY
             </div>
             <p className="text-slate-500 text-xs">
                Add these variables to your environment configuration.
             </p>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">
                {isSignUp ? 'Create Account' : 'Welcome Back'}
            </h2>

            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4 text-sm font-bold border border-red-100 text-center">
                    {error}
                </div>
            )}

            {message && (
                <div className="bg-green-50 text-green-600 p-3 rounded-xl mb-4 text-sm font-bold border border-green-100 text-center">
                    {message}
                </div>
            )}

            <form onSubmit={handleAuth} className="space-y-4">
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1 block mb-1">Email</label>
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="clay-inset w-full px-4 py-3 text-slate-700 font-bold outline-none focus:ring-2 focus:ring-emerald-400 rounded-xl"
                        placeholder="you@garden.com"
                    />
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1 block mb-1">Password</label>
                    <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="clay-inset w-full px-4 py-3 text-slate-700 font-bold outline-none focus:ring-2 focus:ring-emerald-400 rounded-xl"
                        placeholder="••••••••"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full clay-btn-primary py-4 font-bold text-lg mt-4 flex items-center justify-center disabled:opacity-70"
                >
                    {loading ? (
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                        isSignUp ? 'Sign Up' : 'Log In'
                    )}
                </button>
            </form>

            <div className="mt-6 text-center">
                <button 
                    onClick={() => {
                        setIsSignUp(!isSignUp);
                        setError(null);
                        setMessage(null);
                    }}
                    className="text-emerald-600 font-bold text-sm hover:underline"
                >
                    {isSignUp ? 'Already have an account? Log In' : 'New here? Create Account'}
                </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};