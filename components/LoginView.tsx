
import React, { useState } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';
import { LeafIcon, AlertIcon, ArrowLeftIcon } from './Icons';

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
    <div className="min-h-screen flex flex-col md:flex-row bg-[#ecfdf5] overflow-hidden">
       {/* Hero Section */}
       <div className="relative flex-1 bg-gradient-to-br from-emerald-600 to-teal-800 p-8 md:p-16 flex flex-col justify-between overflow-hidden">
          {/* Decorative Circles */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/4 w-64 h-64 bg-emerald-400/20 rounded-full blur-2xl"></div>

          <div className="relative z-10">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 border border-white/30 shadow-lg">
                 <LeafIcon className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-5xl md:text-6xl font-extrabold italic text-white tracking-tight mb-4">Verdant</h1>
              <p className="text-emerald-100 text-xl font-medium max-w-md leading-relaxed">
                  Your intelligent companion for a thriving garden. Diagnose issues, track care, and grow with confidence.
              </p>
          </div>

          <div className="relative z-10 mt-12 md:mt-0">
             <div className="flex gap-2 mb-2">
                {[1,2,3,4,5].map(i => (
                    <div key={i} className="w-8 h-1 bg-emerald-400/50 rounded-full"></div>
                ))}
             </div>
             <p className="text-white/60 text-sm font-bold tracking-wider uppercase">Trusted by 10,000+ Gardeners</p>
          </div>
       </div>

       {/* Form Section */}
       <div className="flex-1 flex items-center justify-center p-6 relative">
          <div className="w-full max-w-md">
            {!isSupabaseConfigured ? (
              <div className="clay-card p-8 text-center animate-bounce">
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
              </div>
            ) : (
              <div className="clay-card p-8 md:p-12 shadow-2xl">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-slate-800 mb-2">
                        {isSignUp ? 'Create Account' : 'Welcome Back'}
                    </h2>
                    <p className="text-slate-500">
                        {isSignUp ? 'Start your journey to a greener home.' : 'Enter your details to access your garden.'}
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm font-bold border border-red-100 flex items-center gap-3">
                        <AlertIcon className="w-5 h-5" />
                        {error}
                    </div>
                )}

                {message && (
                    <div className="bg-green-50 text-green-600 p-4 rounded-xl mb-6 text-sm font-bold border border-green-100">
                        {message}
                    </div>
                )}

                <form onSubmit={handleAuth} className="space-y-5">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-400 uppercase ml-1">Email Address</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="clay-inset w-full px-4 py-3.5 text-slate-700 font-bold outline-none focus:ring-2 focus:ring-emerald-500 rounded-xl transition-shadow bg-[#f8fafc]"
                            placeholder="name@example.com"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-400 uppercase ml-1">Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="clay-inset w-full px-4 py-3.5 text-slate-700 font-bold outline-none focus:ring-2 focus:ring-emerald-500 rounded-xl transition-shadow bg-[#f8fafc]"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full clay-btn-primary py-4 font-bold text-lg mt-4 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-[0.98] transition-all shadow-lg"
                    >
                        {loading ? (
                            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            isSignUp ? 'Create Account' : 'Sign In'
                        )}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                    <p className="text-slate-400 text-sm font-medium mb-2">
                        {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                    </p>
                    <button 
                        onClick={() => {
                            setIsSignUp(!isSignUp);
                            setError(null);
                            setMessage(null);
                        }}
                        className="text-emerald-600 font-bold text-sm hover:text-emerald-700 transition-colors uppercase tracking-wide"
                    >
                        {isSignUp ? 'Log In' : 'Sign Up Now'}
                    </button>
                </div>
              </div>
            )}
          </div>
       </div>
    </div>
  );
};
