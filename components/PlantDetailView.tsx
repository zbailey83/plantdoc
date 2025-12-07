import React, { useState } from 'react';
import { Plant, HealthStatus } from '../types';
import { ArrowLeftIcon, DropIcon, CheckIcon, AlertIcon, EditIcon, CheckIcon as SaveIcon, XIcon, SprayIcon, SparklesIcon } from './Icons';

interface PlantDetailViewProps {
  plant: Plant;
  onBack: () => void;
  onDelete: (id: string) => void;
  onWater: (id: string) => void;
  onMist: (id: string) => void;
  onFertilize: (id: string) => void;
  onUpdate: (updatedPlant: Plant) => void;
}

export const PlantDetailView: React.FC<PlantDetailViewProps> = ({ plant, onBack, onDelete, onWater, onMist, onFertilize, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(plant.name);
  
  // Frequency State
  const [editWaterFreq, setEditWaterFreq] = useState(plant.schedule.waterFrequencyDays.toString());
  const [editMistFreq, setEditMistFreq] = useState((plant.schedule.mistFrequencyDays || 0).toString());
  const [editFertFreq, setEditFertFreq] = useState((plant.schedule.fertilizeFrequencyDays || 0).toString());

  const isHealthy = plant.status === HealthStatus.THRIVING;
  const acquired = new Date(plant.acquiredDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const handleSave = () => {
    const wFreq = parseInt(editWaterFreq);
    const mFreq = parseInt(editMistFreq);
    const fFreq = parseInt(editFertFreq);

    if (!editName.trim() || isNaN(wFreq) || wFreq < 1) {
        alert("Please enter a valid name and watering frequency (min 1 day).");
        return;
    }
    
    // Recalculate next dates if frequencies changed (keeping last watered date anchor)
    const calculateNextDate = (lastDateIso: string | undefined, freq: number) => {
        if (!lastDateIso || freq <= 0) return undefined;
        const last = new Date(lastDateIso);
        return new Date(last.getTime() + freq * 24 * 60 * 60 * 1000).toISOString();
    };

    const updatedPlant: Plant = {
        ...plant,
        name: editName,
        schedule: {
            ...plant.schedule,
            waterFrequencyDays: wFreq,
            nextWatering: calculateNextDate(plant.schedule.lastWatered, wFreq) || new Date().toISOString(),
            
            mistFrequencyDays: isNaN(mFreq) ? 0 : mFreq,
            nextMisting: calculateNextDate(plant.schedule.lastMisted, mFreq),

            fertilizeFrequencyDays: isNaN(fFreq) ? 0 : fFreq,
            nextFertilizing: calculateNextDate(plant.schedule.lastFertilized, fFreq),
        }
    };

    onUpdate(updatedPlant);
    setIsEditing(false);
  };

  const cancelEdit = () => {
      setEditName(plant.name);
      setEditWaterFreq(plant.schedule.waterFrequencyDays.toString());
      setEditMistFreq((plant.schedule.mistFrequencyDays || 0).toString());
      setEditFertFreq((plant.schedule.fertilizeFrequencyDays || 0).toString());
      setIsEditing(false);
  };

  const CareRow = ({ 
    icon: Icon, 
    label, 
    frequency, 
    editValue, 
    setEditValue, 
    nextDate, 
    colorClass,
    bgClass,
    onAction 
  }: any) => {
      const isDue = nextDate ? new Date(nextDate) <= new Date() : false;
      const dateDisplay = nextDate 
        ? new Date(nextDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) 
        : 'Not Scheduled';
      const isActive = frequency > 0;

      return (
        <div className={`clay-card p-4 flex items-center justify-between mb-4 ${!isActive && !isEditing ? 'opacity-60' : ''}`}>
            <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-[16px] flex items-center justify-center ${bgClass} shadow-sm`}>
                    <Icon className={`w-6 h-6 ${colorClass}`} />
                </div>
                <div>
                    <p className="font-bold text-slate-800">{label}</p>
                    {isEditing ? (
                         <div className="flex items-center mt-1">
                             <span className="text-xs font-bold text-slate-400 mr-2">Every</span>
                             <input 
                                type="number" 
                                min="0"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                className="w-12 bg-white rounded border border-slate-200 text-center text-sm font-bold outline-none focus:border-emerald-500"
                             />
                             <span className="text-xs font-bold text-slate-400 ml-1">days</span>
                         </div>
                    ) : (
                        <p className="text-xs font-bold text-slate-500">
                           {isActive ? (isDue ? <span className="text-red-500">Due Today</span> : `Due ${dateDisplay}`) : 'Not Required'}
                        </p>
                    )}
                </div>
            </div>

            {!isEditing && isActive && (
                <button 
                  onClick={onAction}
                  className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform ${isDue ? 'clay-btn-primary' : 'bg-slate-100'}`}
                >
                  <CheckIcon className={`w-5 h-5 ${isDue ? 'text-white' : 'text-slate-300'}`} />
                </button>
            )}
            {isEditing && (
                 <div className="text-xs text-slate-400 font-bold px-2 py-1 bg-slate-100 rounded">
                     {parseInt(editValue) > 0 ? `${editValue}d` : 'Off'}
                 </div>
            )}
        </div>
      );
  };

  return (
    <div className="min-h-screen bg-[#ecfdf5] pb-24 relative">
       {/* Hero Section */}
      <div className="relative h-[45vh] w-full">
        <div className="absolute inset-0 rounded-b-[48px] overflow-hidden shadow-2xl z-0">
             <img src={plant.imageUrl} alt={plant.name} className="w-full h-full object-cover" />
             <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
        </div>
        
        <button 
          onClick={onBack} 
          className="absolute top-6 left-6 w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-lg z-10 hover:bg-white/30 transition-colors active:scale-95"
        >
          <ArrowLeftIcon className="w-6 h-6" />
        </button>

        <button 
          onClick={() => isEditing ? cancelEdit() : setIsEditing(true)} 
          className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-lg z-10 hover:bg-white/30 transition-colors active:scale-95"
        >
          {isEditing ? <XIcon className="w-6 h-6" /> : <EditIcon className="w-6 h-6" />}
        </button>

        <div className="absolute bottom-10 left-6 right-6 z-10">
            {isEditing ? (
                <div className="mb-2">
                    <input 
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full bg-black/30 backdrop-blur-md border border-white/30 rounded-xl px-4 py-2 text-3xl font-bold text-white outline-none focus:border-white/60"
                        autoFocus
                    />
                </div>
            ) : (
                <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-md">{plant.name}</h1>
            )}
            
            <p className="text-white/80 font-medium text-lg mb-4">{plant.species}</p>
            
            {!isEditing && (
                <div className="flex gap-3">
                    <div className={`px-4 py-2 rounded-full backdrop-blur-md bg-white/10 border border-white/20 flex items-center gap-2 ${
                        isHealthy ? 'text-emerald-300' : 'text-red-300'
                    }`}>
                        {isHealthy ? <CheckIcon className="w-4 h-4" /> : <AlertIcon className="w-4 h-4" />}
                        <span className="font-bold text-sm uppercase tracking-wide">{plant.status}</span>
                    </div>
                </div>
            )}
        </div>
      </div>

      {/* Actions & Info */}
      <div className="px-6 -mt-8 relative z-10 space-y-6">
        
        {/* Care Schedule List */}
        <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 ml-1">Care Schedule</h3>
            
            <CareRow 
                icon={DropIcon}
                label="Watering"
                frequency={plant.schedule.waterFrequencyDays}
                editValue={editWaterFreq}
                setEditValue={setEditWaterFreq}
                nextDate={plant.schedule.nextWatering}
                colorClass="text-blue-500"
                bgClass="bg-blue-50"
                onAction={() => onWater(plant.id)}
            />

            <CareRow 
                icon={SprayIcon}
                label="Misting"
                frequency={plant.schedule.mistFrequencyDays || 0}
                editValue={editMistFreq}
                setEditValue={setEditMistFreq}
                nextDate={plant.schedule.nextMisting}
                colorClass="text-cyan-500"
                bgClass="bg-cyan-50"
                onAction={() => onMist(plant.id)}
            />

            <CareRow 
                icon={SparklesIcon}
                label="Fertilizing"
                frequency={plant.schedule.fertilizeFrequencyDays || 0}
                editValue={editFertFreq}
                setEditValue={setEditFertFreq}
                nextDate={plant.schedule.nextFertilizing}
                colorClass="text-amber-500"
                bgClass="bg-amber-50"
                onAction={() => onFertilize(plant.id)}
            />
        </div>

        {isEditing && (
             <button 
                onClick={handleSave}
                className="w-full clay-btn-primary py-3 font-bold text-lg flex items-center justify-center gap-2"
            >
                <SaveIcon className="w-5 h-5" /> Save Changes
            </button>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
             <div className="clay-card-sm p-4">
                <p className="text-slate-400 text-xs font-bold uppercase mb-2">Age</p>
                <p className="text-slate-700 font-bold">{acquired}</p>
             </div>
             <div className="clay-card-sm p-4">
                <p className="text-slate-400 text-xs font-bold uppercase mb-2">Total Diagnosis</p>
                <p className="text-slate-700 font-bold">{plant.diagnosisHistory.length} Checkups</p>
             </div>
        </div>

        {/* Diagnosis History */}
        <div className="clay-card p-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-slate-700">Health History</h3>
            </div>
            
            <div className="space-y-4">
                {plant.diagnosisHistory.length === 0 ? (
                    <p className="text-slate-400 text-sm italic">No diagnosis history yet.</p>
                ) : (
                    plant.diagnosisHistory.slice(0, 3).map((diag, i) => (
                        <div key={i} className="flex gap-4 items-start pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                            <div className={`mt-1 w-2 h-2 rounded-full ${diag.healthStatus === 'Thriving' ? 'bg-emerald-400' : 'bg-red-400'}`}></div>
                            <div>
                                <p className="font-bold text-slate-700 text-sm">{diag.diagnosis}</p>
                                <p className="text-slate-400 text-xs mt-0.5 line-clamp-1">{diag.reasoning}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>

        {/* Danger Zone */}
        {!isEditing && (
            <div className="pt-4">
                <button 
                    onClick={() => {
                        if(confirm("Are you sure you want to delete this plant? This cannot be undone.")) {
                            onDelete(plant.id);
                        }
                    }}
                    className="w-full clay-btn-danger py-4 font-bold text-lg"
                >
                    Delete Plant
                </button>
            </div>
        )}
      </div>
    </div>
  );
};