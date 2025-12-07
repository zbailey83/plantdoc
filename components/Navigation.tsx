import React from 'react';
import { ViewState } from '../types';
import { LeafIcon, CameraIcon, VideoIcon, SearchIcon } from './Icons';

interface NavigationProps {
  currentView: ViewState;
  onChange: (view: ViewState) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentView, onChange }) => {
  const navItemClass = (view: ViewState) => 
    `flex flex-col items-center justify-center w-14 h-14 rounded-2xl transition-all duration-300 ${
      currentView === view 
        ? 'text-emerald-600 clay-inset transform translate-y-1' 
        : 'text-slate-400 hover:bg-slate-50'
    }`;

  return (
    <div className="fixed bottom-6 left-6 right-6 h-24 clay-card flex items-center justify-between px-4 z-50 max-w-md mx-auto">
      <button className={navItemClass('dashboard')} onClick={() => onChange('dashboard')}>
        <LeafIcon className="w-6 h-6" />
      </button>
      
      <button className={navItemClass('database')} onClick={() => onChange('database')}>
        <SearchIcon className="w-6 h-6" />
      </button>

      {/* Floating Action Button for Camera */}
      <button 
        className="relative -top-12 clay-btn-primary w-20 h-20 rounded-[28px] flex items-center justify-center transform transition-transform hover:-translate-y-13 mx-2"
        onClick={() => onChange('camera')}
      >
        <CameraIcon className="w-9 h-9 text-white" />
      </button>

      <button className={navItemClass('expert')} onClick={() => onChange('expert')}>
        <VideoIcon className="w-6 h-6" />
      </button>
      
      {/* Spacer to balance items if needed, but flex-between handles it well with 4 items + center FAB. 
          The previous design had 3 items. Now we have 4.
      */}
      <div className="w-4" /> 
    </div>
  );
};