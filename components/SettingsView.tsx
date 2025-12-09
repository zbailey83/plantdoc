import React, { useState, useEffect } from 'react';
import { XIcon, UserIcon, CheckIcon, EditIcon } from './Icons';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../services/supabaseClient';
import { UserProfile } from '../types';

interface SettingsViewProps {
  onClose: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onClose }) => {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Preferences (Local state for now, could be moved to DB)
  const [notifications, setNotifications] = useState(true);
  const [seasonalTips, setSeasonalTips] = useState(true);

  // Edit Mode
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');

  useEffect(() => {
    if (user) {
      getProfile();
    }
  }, [user]);

  const getProfile = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      
      if (data) {
        setProfile(data);
        setEditName(data.full_name || '');
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: editName, updated_at: new Date() })
        .eq('id', user.id);

      if (error) throw error;
      setProfile(prev => prev ? { ...prev, full_name: editName } : null);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const Toggle = ({ active, onToggle }: { active: boolean; onToggle: () => void }) => (
    <button 
      onClick={onToggle}
      className={`w-14 h-8 rounded-full clay-inset p-1 transition-colors duration-300 relative ${active ? 'bg-emerald-100' : 'bg-slate-100'}`}
    >
      <div 
        className={`w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 bg-white border border-slate-100 ${
          active ? 'translate-x-6 bg-emerald-500' : 'translate-x-0'
        }`}
      />
    </button>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center pointer-events-none">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm pointer-events-auto transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="bg-[#ecfdf5] w-full max-w-md h-[85vh] sm:h-auto sm:rounded-[40px] rounded-t-[40px] p-6 clay-card shadow-2xl relative z-10 pointer-events-auto transform transition-transform animate-[slideUp_0.3s_ease-out]">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-slate-800">Settings</h2>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-slate-200/50 flex items-center justify-center text-slate-600 active:scale-95 transition-transform"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* User Profile */}
        <div className="clay-card p-6 mb-6 flex items-center gap-4 relative group">
          <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-white shadow-inner flex items-center justify-center text-emerald-600 shrink-0">
             <UserIcon className="w-8 h-8" />
          </div>
          
          <div className="flex-1 overflow-hidden">
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-slate-400 uppercase ml-1">Profile</label>
              {!isEditing ? (
                 <button onClick={() => setIsEditing(true)} className="p-1 rounded-full hover:bg-slate-100 text-slate-400">
                    <EditIcon className="w-4 h-4" />
                 </button>
              ) : (
                <button onClick={updateProfile} disabled={loading} className="p-1 rounded-full bg-emerald-100 text-emerald-600">
                    <CheckIcon className="w-4 h-4" />
                </button>
              )}
            </div>

            {isEditing ? (
                <input 
                   autoFocus
                   value={editName}
                   onChange={(e) => setEditName(e.target.value)}
                   placeholder="Enter your name"
                   className="w-full bg-white/50 border border-slate-200 rounded-lg px-2 py-1 text-slate-800 font-bold outline-none focus:ring-2 ring-emerald-400"
                />
            ) : (
                <p className="text-lg font-bold text-slate-700 truncate">
                    {profile?.full_name || 'Gardener'}
                </p>
            )}
            <p className="text-sm text-slate-500 truncate font-medium">{user?.email}</p>
          </div>
        </div>

        {/* Preferences */}
        <div className="space-y-4 mb-8">
            <h3 className="text-slate-500 font-bold text-sm uppercase tracking-wider ml-2">Preferences</h3>
            
            <div className="clay-card-sm p-4 flex items-center justify-between">
                <span className="font-bold text-slate-700">Push Notifications</span>
                <Toggle active={notifications} onToggle={() => setNotifications(!notifications)} />
            </div>

            <div className="clay-card-sm p-4 flex items-center justify-between">
                <span className="font-bold text-slate-700">Seasonal Care Tips</span>
                <Toggle active={seasonalTips} onToggle={() => setSeasonalTips(!seasonalTips)} />
            </div>
        </div>

        {/* Subscription Info */}
        <div className="clay-card p-6 bg-gradient-to-r from-purple-50 to-white border border-purple-100">
           <div className="flex justify-between items-start mb-2">
             <h3 className="font-bold text-slate-800">PlantDoc Premium</h3>
             <span className="bg-slate-200 text-slate-500 text-xs font-bold px-2 py-1 rounded-lg">FREE TIER</span>
           </div>
           <p className="text-sm text-slate-500 mb-4">Upgrade for unlimited AI diagnosis and expert support.</p>
           <button className="w-full py-3 rounded-xl bg-slate-800 text-white font-bold shadow-lg active:scale-95 transition-transform">
             Upgrade Plan
           </button>
        </div>

        <div className="mt-8 text-center">
            <button 
                onClick={() => {
                    signOut();
                    onClose();
                }} 
                className="text-red-400 font-bold text-sm hover:text-red-600 transition-colors"
            >
                Log Out
            </button>
        </div>

        <style>{`
            @keyframes slideUp {
                from { transform: translateY(100%); }
                to { transform: translateY(0); }
            }
        `}</style>
      </div>
    </div>
  );
};