import React from 'react';
import { Plant, HealthStatus } from '../types';
import { DropIcon, AlertIcon, CheckIcon, SprayIcon, SparklesIcon } from './Icons';

interface PlantCardProps {
  plant: Plant;
  onClick: () => void;
}

export const PlantCard: React.FC<PlantCardProps> = ({ plant, onClick }) => {
  const isCritical = plant.status === HealthStatus.CRITICAL;
  const isRecovering = plant.status === HealthStatus.RECOVERING;

  const getDaysDiff = (dateStr?: string) => {
    if (!dateStr) return 999;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(dateStr);
    target.setHours(0, 0, 0, 0);
    const diffTime = target.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const waterDiff = getDaysDiff(plant.schedule.nextWatering);
  const mistDiff = getDaysDiff(plant.schedule.nextMisting);
  const fertDiff = getDaysDiff(plant.schedule.nextFertilizing);

  // Identify tasks due today (<= 0)
  const tasks = [
    { id: 'water', label: 'Water', diff: waterDiff, icon: DropIcon },
    { id: 'mist', label: 'Mist', diff: mistDiff, icon: SprayIcon },
    { id: 'fert', label: 'Feed', diff: fertDiff, icon: SparklesIcon },
  ];

  const urgentTasks = tasks.filter(t => t.diff <= 0);
  const upcomingTask = tasks.sort((a, b) => a.diff - b.diff).find(t => t.diff > 0);
  
  const hasOverdue = urgentTasks.some(t => t.diff < 0);

  // Dynamic Styles based on state
  const cardBgClass = hasOverdue ? 'bg-red-50/90 border-red-200' : 'bg-white/85 border-white/60';

  return (
    <div 
      onClick={onClick}
      className={`clay-card p-4 mb-5 flex items-center gap-4 cursor-pointer transform transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${cardBgClass} border`}
    >
      {/* Visual Health Indicator: Colored Ring around Image */}
      <div className="relative shrink-0">
        <div className={`w-20 h-20 rounded-[20px] shadow-sm overflow-hidden border-[3px] transition-colors duration-300 ${
            isCritical ? 'border-red-400' : isRecovering ? 'border-orange-400' : 'border-white'
        }`}>
          <img 
            src={plant.imageUrl} 
            alt={plant.name} 
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Status Badge */}
        <div className={`absolute -bottom-2 -right-2 w-7 h-7 rounded-full border-[3px] border-white flex items-center justify-center shadow-md ${
          isCritical ? 'bg-red-500' : isRecovering ? 'bg-orange-400' : 'bg-emerald-500'
        }`}>
          {isCritical ? <AlertIcon className="w-3.5 h-3.5 text-white" /> : <CheckIcon className="w-3.5 h-3.5 text-white" />}
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start mb-1">
            <h3 className="text-lg font-bold text-slate-800 leading-tight truncate">{plant.name}</h3>
            {/* Alert indicator if overdue */}
            {hasOverdue && <span className="text-red-500 font-bold text-lg animate-pulse">!</span>}
        </div>
        <p className="text-xs text-slate-500 font-bold mb-3 truncate opacity-80">{plant.species}</p>
        
        {/* Task Indicators */}
        <div className="flex flex-wrap gap-2">
          {urgentTasks.length > 0 ? (
            urgentTasks.map(task => (
                <div key={task.id} className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg shadow-sm transition-colors ${
                    task.diff < 0 ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'
                }`}>
                    <task.icon className="w-3 h-3" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">
                        {task.diff < 0 ? 'Late' : 'Today'}
                    </span>
                </div>
            ))
          ) : (
            <div className="flex items-center gap-2 px-2.5 py-1.5 bg-slate-100/80 rounded-lg">
                {upcomingTask ? (
                    <>
                        <upcomingTask.icon className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-xs font-bold text-slate-500">
                             {upcomingTask.label} in {upcomingTask.diff}d
                        </span>
                    </>
                ) : (
                     <span className="text-xs font-bold text-slate-400">All caught up!</span>
                )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};