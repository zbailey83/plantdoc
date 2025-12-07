import React from 'react';
import { DiagnosisResult, HealthStatus, Plant } from '../types';
import { ArrowLeftIcon, CheckIcon, AlertIcon, DropIcon } from './Icons';

interface DiagnosisResultViewProps {
  result: DiagnosisResult;
  imageUrl: string;
  onSave: (plant: Plant) => void;
  onDiscard: () => void;
}

export const DiagnosisResultView: React.FC<DiagnosisResultViewProps> = ({ result, imageUrl, onSave, onDiscard }) => {
  const isHealthy = result.healthStatus === HealthStatus.THRIVING;
  
  const handleSave = () => {
    // Construct new plant object
    const newPlant: Plant = {
      id: Date.now().toString(), // Simple ID
      name: result.plantName,
      species: result.scientificName,
      imageUrl: imageUrl,
      acquiredDate: new Date().toISOString(),
      status: result.healthStatus,
      diagnosisHistory: [result],
      schedule: {
        waterFrequencyDays: result.suggestedWaterFrequency,
        lastWatered: new Date().toISOString(), // Assume watered today if setting up
        nextWatering: new Date(Date.now() + result.suggestedWaterFrequency * 24 * 60 * 60 * 1000).toISOString(),
      }
    };
    onSave(newPlant);
  };

  return (
    <div className="min-h-screen bg-[#ecfdf5] pb-24 relative overflow-x-hidden">
       {/* Hero Image */}
      <div className="relative h-[40vh] w-full">
        <div className="absolute inset-0 rounded-b-[48px] overflow-hidden shadow-2xl z-0">
             <img src={imageUrl} alt="Diagnosis" className="w-full h-full object-cover" />
             <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        </div>
        
        <button 
          onClick={onDiscard} 
          className="absolute top-6 left-6 w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-lg z-10 hover:bg-white/30 transition-colors"
        >
          <ArrowLeftIcon className="w-6 h-6" />
        </button>

        <div className="absolute bottom-8 left-6 right-6 z-10">
            <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-md">{result.plantName}</h1>
            <p className="text-white/90 font-medium text-lg backdrop-blur-sm inline-block px-3 py-1 rounded-full bg-white/10 border border-white/20">
                {result.scientificName}
            </p>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 -mt-8 relative z-10 space-y-6">
        
        {/* Status Badge - Floating */}
        <div className="flex justify-center">
            <div className={`clay-card px-6 py-3 flex items-center gap-3 ${isHealthy ? 'text-emerald-600' : 'text-red-500'}`}>
                {isHealthy ? <CheckIcon className="w-6 h-6" /> : <AlertIcon className="w-6 h-6" />}
                <span className="font-bold text-lg uppercase tracking-wide">{result.healthStatus}</span>
            </div>
        </div>

        {/* Diagnosis Card */}
        <div className="clay-card p-6">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Diagnosis Report</h2>
          <div className="mb-4">
               <h3 className="font-bold text-slate-800 text-2xl mb-1">{result.diagnosis}</h3>
               <div className="w-full bg-slate-100 rounded-full h-2 mt-2">
                 <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${result.confidence}%` }}></div>
               </div>
               <p className="text-xs text-slate-400 mt-1 text-right">{result.confidence}% Confidence</p>
          </div>
          <div className="clay-inset p-4 rounded-2xl bg-slate-50">
            <p className="text-slate-600 leading-relaxed font-medium">
                {result.reasoning}
            </p>
          </div>
        </div>

        {/* Treatment Plan */}
        <div className="clay-card p-6">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Care Plan</h2>
          <ul className="space-y-4">
            {result.carePlan.map((step, idx) => (
              <li key={idx} className="flex gap-4 items-start">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold shadow-sm mt-0.5">
                  {idx + 1}
                </span>
                <p className="text-slate-700 font-medium pt-1">{step}</p>
              </li>
            ))}
          </ul>
        </div>

         {/* Schedule Preview */}
         <div className="clay-card p-6 flex items-center justify-between">
            <div>
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Water Schedule</h2>
              <p className="text-slate-800 font-bold text-lg">Every {result.suggestedWaterFrequency} days</p>
            </div>
            <div className="w-14 h-14 bg-blue-50 rounded-[20px] flex items-center justify-center shadow-inner">
              <DropIcon className="w-7 h-7 text-blue-500" />
            </div>
         </div>

         <div className="pt-4">
            <button 
            onClick={handleSave}
            className="w-full clay-btn-primary py-4 font-bold text-xl"
            >
                Add to Garden
            </button>
            <button 
                onClick={onDiscard}
                className="w-full py-4 text-slate-400 font-bold mt-2 hover:text-slate-600 transition-colors"
            >
                Discard Result
            </button>
         </div>
      </div>
    </div>
  );
};