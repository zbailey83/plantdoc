import React, { useState } from 'react';
import { Plant, HealthStatus } from '../types';
import { ArrowLeftIcon, DropIcon, CheckIcon, AlertIcon, EditIcon, CheckIcon as SaveIcon, XIcon } from './Icons';

interface PlantDetailViewProps {
  plant: Plant;
  onBack: () => void;
  onDelete: (id: string) => void;
  onWater: (id: string) => void;
  onUpdate: (updatedPlant: Plant) => void;
}

export const PlantDetailView: React.FC<PlantDetailViewProps> = ({ plant, onBack, onDelete, onWater, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(plant.name);
  const [editFrequency, setEditFrequency] = useState(plant.schedule.waterFrequencyDays.toString());

  const isHealthy = plant.status === HealthStatus.THRIVING;
  
  // Format dates
  const nextWater = new Date(plant.schedule.nextWatering).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const lastWater = new Date(plant.schedule.lastWatered).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const acquired = new Date(plant.acquiredDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const handleSave = () => {
    const freq = parseInt(editFrequency);
    if (!editName.trim() || isNaN(freq) || freq < 1) {
        alert("Please enter valid name and frequency (days).");
        return;
    }
    
    // Update plant logic
    // We also need to recalculate next watering if frequency changed, but for simplicity let's keep next date unless we want to reschedule.
    // Let's assume changing frequency keeps the anchor (last watered) but shifts the next date relative to last watered.
    
    const lastWateredDate = new Date(plant.schedule.lastWatered);
    const newNextWatering = new Date(lastWateredDate.getTime() + freq * 24 * 60 * 60 * 1000).toISOString();

    const updatedPlant: Plant = {
        ...plant,
        name: editName,
        schedule: {
            ...plant.schedule,
            waterFrequencyDays: freq,
            nextWatering: newNextWatering
        }
    };

    onUpdate(updatedPlant);
    setIsEditing(false);
  };

  const cancelEdit = () => {
      setEditName(plant.name);
      setEditFrequency(plant.schedule.waterFrequencyDays.toString());
      setIsEditing(false);
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
        
        {/* Quick Actions Card */}
        <div className="clay-card p-6 flex justify-between items-center transition-all duration-300">
            <div className="text-center">
                <p className="text-xs font-bold text-slate-400 uppercase mb-1">Next Water</p>
                <p className="text-xl font-bold text-slate-800">{nextWater}</p>
            </div>
            <div className="h-10 w-[1px] bg-slate-200"></div>
            <div className="text-center">
                <p className="text-xs font-bold text-slate-400 uppercase mb-1">Frequency</p>
                {isEditing ? (
                    <div className="flex items-center justify-center w-20 mx-auto border-b-2 border-slate-300">
                        <input 
                            type="number" 
                            value={editFrequency}
                            onChange={(e) => setEditFrequency(e.target.value)}
                            className="w-12 bg-transparent text-xl font-bold text-slate-800 text-center outline-none"
                        />
                        <span className="text-sm text-slate-500 font-bold">d</span>
                    </div>
                ) : (
                    <p className="text-xl font-bold text-slate-800">{plant.schedule.waterFrequencyDays} Days</p>
                )}
            </div>
             <button 
                  onClick={() => onWater(plant.id)}
                  disabled={isEditing}
                  className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform ${isEditing ? 'bg-slate-200 text-slate-400' : 'clay-btn-primary text-white'}`}
                >
                  <DropIcon className="w-6 h-6" />
            </button>
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
                <p className="text-slate-400 text-xs font-bold uppercase mb-2">Last Watered</p>
                <p className="text-slate-700 font-bold">{lastWater}</p>
             </div>
        </div>

        {/* Diagnosis History */}
        <div className="clay-card p-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-slate-700">Health History</h3>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded-lg">{plant.diagnosisHistory.length} Checkups</span>
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