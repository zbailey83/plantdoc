import React from 'react';
import { Species } from '../types';
import { ArrowLeftIcon, SunIcon, DropIcon, ThermometerIcon, WindIcon, PlusIcon } from './Icons';

interface SpeciesDetailViewProps {
  species: Species;
  onBack: () => void;
  onAdd: (species: Species) => void;
}

export const SpeciesDetailView: React.FC<SpeciesDetailViewProps> = ({ species, onBack, onAdd }) => {
  return (
    <div className="min-h-screen bg-[#ecfdf5] pb-32 relative overflow-x-hidden">
       {/* Hero Image */}
      <div className="relative h-[40vh] w-full">
        <div className="absolute inset-0 rounded-b-[48px] overflow-hidden shadow-2xl z-0">
             <img src={species.imageUrl} alt={species.commonName} className="w-full h-full object-cover" />
             <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        </div>
        
        <button 
          onClick={onBack} 
          className="absolute top-6 left-6 w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-lg z-10 hover:bg-white/30 transition-colors active:scale-95"
        >
          <ArrowLeftIcon className="w-6 h-6" />
        </button>

        <div className="absolute bottom-8 left-6 right-6 z-10">
            <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-md">{species.commonName}</h1>
            <p className="text-white/90 font-medium text-lg italic backdrop-blur-sm inline-block px-3 py-1 rounded-full bg-white/10 border border-white/20">
                {species.scientificName}
            </p>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 -mt-8 relative z-10 space-y-6">
        
        {/* Description Card */}
        <div className="clay-card p-6">
          <p className="text-slate-600 leading-relaxed font-medium">
            {species.description}
          </p>
        </div>

        {/* Care Requirements */}
        <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Care Requirements</h3>
            
            {/* Water */}
            <div className="clay-card p-4 flex items-start gap-4">
               <div className="w-12 h-12 bg-blue-50 rounded-[16px] flex items-center justify-center shrink-0">
                  <DropIcon className="w-6 h-6 text-blue-500" />
               </div>
               <div>
                  <h4 className="font-bold text-slate-800">Water</h4>
                  <p className="text-sm text-slate-600 font-medium mt-1">{species.care.water}</p>
               </div>
            </div>

            {/* Light */}
            <div className="clay-card p-4 flex items-start gap-4">
               <div className="w-12 h-12 bg-amber-50 rounded-[16px] flex items-center justify-center shrink-0">
                  <SunIcon className="w-6 h-6 text-amber-500" />
               </div>
               <div>
                  <h4 className="font-bold text-slate-800">Light</h4>
                  <p className="text-sm text-slate-600 font-medium mt-1">{species.care.light}</p>
               </div>
            </div>

            {/* Temperature */}
            <div className="clay-card p-4 flex items-start gap-4">
               <div className="w-12 h-12 bg-rose-50 rounded-[16px] flex items-center justify-center shrink-0">
                  <ThermometerIcon className="w-6 h-6 text-rose-500" />
               </div>
               <div>
                  <h4 className="font-bold text-slate-800">Temperature</h4>
                  <p className="text-sm text-slate-600 font-medium mt-1">{species.care.temperature}</p>
               </div>
            </div>

             {/* Humidity */}
             <div className="clay-card p-4 flex items-start gap-4">
               <div className="w-12 h-12 bg-cyan-50 rounded-[16px] flex items-center justify-center shrink-0">
                  <WindIcon className="w-6 h-6 text-cyan-500" />
               </div>
               <div>
                  <h4 className="font-bold text-slate-800">Humidity</h4>
                  <p className="text-sm text-slate-600 font-medium mt-1">{species.care.humidity}</p>
               </div>
            </div>
        </div>

        {/* Common Issues */}
        <div className="clay-card p-6 border border-red-100 bg-red-50/50">
           <h3 className="font-bold text-red-500 mb-3">Common Issues</h3>
           <ul className="space-y-2">
              {species.commonIssues.map((issue, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-400"></div>
                      <span className="text-slate-700 font-medium text-sm">{issue}</span>
                  </li>
              ))}
           </ul>
        </div>
      </div>

      {/* Floating Add Button */}
      <div className="fixed bottom-6 left-0 right-0 p-6 pt-0 bg-gradient-to-t from-[#ecfdf5] to-transparent z-20 pointer-events-none">
          <button 
            onClick={() => onAdd(species)}
            className="w-full clay-btn-primary py-4 font-bold text-xl shadow-xl flex items-center justify-center gap-3 pointer-events-auto active:scale-95 transition-transform"
          >
            <PlusIcon className="w-6 h-6" /> Add to My Garden
          </button>
      </div>
    </div>
  );
};