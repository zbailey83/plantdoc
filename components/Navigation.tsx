import React from 'react';
import { ViewState } from '../types';
import { LeafIcon, CameraIcon, UserIcon, VideoIcon } from './Icons';

interface NavigationProps {
  currentView: ViewState;
  onChange: (view: ViewState) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentView, onChange }) => {
  const navItemClass = (view: ViewState) => 
    `flex flex-col items-center justify-center w-16 h-16 rounded-2xl transition-all duration-300 ${
      currentView === view 
        ? 'text-emerald-600 clay-inset transform translate-y-1' 
        : 'text-slate-400 hover:bg-slate-50'
    }`;

  return (
    <div className="fixed bottom-6 left-6 right-6 h-24 clay-card flex items-center justify-around px-2 z-50 max-w-md mx-auto">
      <button className={navItemClass('dashboard')} onClick={() => onChange('dashboard')}>
        <LeafIcon className="w-7 h-7" />
      </button>

      {/* Floating Action Button for Camera */}
      <button 
        className="relative -top-12 clay-btn-primary w-20 h-20 rounded-[28px] flex items-center justify-center transform transition-transform hover:-translate-y-13"
        onClick={() => onChange('camera')}
      >
        <CameraIcon className="w-9 h-9 text-white" />
      </button>

      <button className={navItemClass('expert')} onClick={() => onChange('expert')}>
        <VideoIcon className="w-7 h-7" />
      </button>
    </div>
  );
};