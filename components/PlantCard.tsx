import React from 'react';
import { Plant, HealthStatus } from '../types';
import { DropIcon, AlertIcon, CheckIcon } from './Icons';

interface PlantCardProps {
  plant: Plant;
  onClick: () => void;
}

export const PlantCard: React.FC<PlantCardProps> = ({ plant, onClick }) => {
  const isCritical = plant.status === HealthStatus.CRITICAL;
  const isRecovering = plant.status === HealthStatus.RECOVERING;

  // Calculate days until next watering
  const today = new Date();
  const nextWater = new Date(plant.schedule.nextWatering);
  const diffTime = nextWater.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  let waterStatus = "";
  let waterColor = "text-slate-500";
  let waterIconBg = "bg-slate-100";
  
  if (diffDays < 0) {
    waterStatus = "Overdue";
    waterColor = "text-red-500";
    waterIconBg = "bg-red-100";
  } else if (diffDays === 0) {
    waterStatus = "Today";
    waterColor = "text-blue-600";
    waterIconBg = "bg-blue-100";
  } else {
    waterStatus = `in ${diffDays} days`;
    waterColor = "text-emerald-600";
    waterIconBg = "bg-emerald-100";
  }

  return (
    <div 
      onClick={onClick}
      className="clay-card p-5 mb-6 flex items-center gap-5 cursor-pointer transform transition-transform hover:scale-[1.01] active:scale-[0.98]"
    >
      <div className="relative shrink-0">
        <div className="w-20 h-20 rounded-[20px] shadow-inner overflow-hidden border-2 border-white/50">
          <img 
            src={plant.imageUrl} 
            alt={plant.name} 
            className="w-full h-full object-cover"
          />
        </div>
        <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full border-4 border-[#ecfdf5] flex items-center justify-center shadow-md ${
          isCritical ? 'bg-red-500' : isRecovering ? 'bg-orange-400' : 'bg-emerald-500'
        }`}>
          {isCritical ? <AlertIcon className="w-4 h-4 text-white" /> : <CheckIcon className="w-4 h-4 text-white" />}
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-bold text-slate-800 leading-tight">{plant.name}</h3>
        <p className="text-sm text-slate-500 font-medium mb-3">{plant.species}</p>
        
        <div className="flex items-center gap-2">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${waterIconBg}`}>
            <DropIcon className={`w-3.5 h-3.5 ${waterColor}`} />
          </div>
          <span className={`text-sm font-bold ${waterColor}`}>Water {waterStatus}</span>
        </div>
      </div>
    </div>
  );
};