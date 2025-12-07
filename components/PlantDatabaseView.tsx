import React, { useState } from 'react';
import { ViewState, Species } from '../types';
import { Navigation } from './Navigation';
import { SearchIcon, ArrowLeftIcon } from './Icons';
import { SPECIES_DB } from '../data/speciesData';

interface PlantDatabaseViewProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
  onSelectSpecies: (species: Species) => void;
}

export const PlantDatabaseView: React.FC<PlantDatabaseViewProps> = ({ currentView, onChangeView, onSelectSpecies }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSpecies = SPECIES_DB.filter(species => 
    species.commonName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    species.scientificName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen pb-32 max-w-md mx-auto relative bg-gradient-to-b from-[#ecfdf5] to-[#f0fdf4]">
        {/* Header */}
        <div className="px-6 pt-12 pb-6">
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight mb-2">Plant Database</h1>
            <p className="text-slate-500 font-medium">Find care info for over 500+ species.</p>
        </div>

        {/* Search Bar */}
        <div className="px-6 mb-8 sticky top-6 z-20">
            <div className="clay-inset flex items-center px-4 py-3 bg-white/50 backdrop-blur-md">
                <SearchIcon className="w-5 h-5 text-slate-400 mr-3" />
                <input 
                    type="text"
                    placeholder="Search plants..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 bg-transparent outline-none text-slate-700 font-bold placeholder-slate-400"
                />
            </div>
        </div>

        {/* Results List */}
        <div className="px-6 space-y-4">
            {filteredSpecies.length === 0 ? (
                <div className="text-center py-10 opacity-50">
                    <p className="font-bold text-slate-500">No plants found matching "{searchTerm}"</p>
                </div>
            ) : (
                filteredSpecies.map(species => (
                    <div 
                        key={species.id}
                        onClick={() => onSelectSpecies(species)}
                        className="clay-card p-4 flex items-center gap-4 cursor-pointer active:scale-[0.98] transition-transform"
                    >
                        <div className="w-16 h-16 rounded-[16px] shadow-inner overflow-hidden shrink-0 border border-white">
                            <img src={species.imageUrl} alt={species.commonName} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-slate-800 text-lg leading-tight truncate">{species.commonName}</h3>
                            <p className="text-sm text-slate-500 italic truncate">{species.scientificName}</p>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                            <ArrowLeftIcon className="w-4 h-4 text-slate-400 rotate-180" />
                        </div>
                    </div>
                ))
            )}
        </div>

        <Navigation currentView={currentView} onChange={onChangeView} />
    </div>
  );
};