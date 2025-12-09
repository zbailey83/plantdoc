
import React, { useState, useEffect } from 'react';
import { LeafIcon, DropIcon, SearchIcon, SparklesIcon, CheckIcon } from './Icons';

interface FeatureLoaderProps {
  onComplete: () => void;
}

const features = [
  { id: 1, text: "Initializing AI Botanist", subtext: "Calibrating diagnostic models...", icon: SparklesIcon, color: "text-purple-500", bg: "bg-purple-100" },
  { id: 2, text: "Loading Your Garden", subtext: "Fetching plant profiles...", icon: LeafIcon, color: "text-emerald-600", bg: "bg-emerald-100" },
  { id: 3, text: "Syncing Schedules", subtext: "Checking water & care reminders...", icon: DropIcon, color: "text-blue-500", bg: "bg-blue-100" },
  { id: 4, text: "Updating Database", subtext: "Accessing 500+ species...", icon: SearchIcon, color: "text-amber-500", bg: "bg-amber-100" },
];

export const FeatureLoader: React.FC<FeatureLoaderProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const totalDuration = 3500; // 3.5 seconds total load time
    const stepDuration = totalDuration / features.length;

    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < features.length - 1) {
          return prev + 1;
        }
        clearInterval(interval);
        setTimeout(onComplete, 800); // Slight delay after final step before unmounting
        return prev;
      });
    }, stepDuration);

    return () => clearInterval(interval);
  }, [onComplete]);

  const activeFeature = features[currentStep];

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#ecfdf5] transition-opacity duration-500">
      <div className="w-full max-w-md px-8 relative">
        
        {/* Central Animation Area */}
        <div className="mb-12 relative h-32 flex items-center justify-center">
            {/* Animated Rings */}
            <div className="absolute inset-0 bg-emerald-400/20 blur-3xl rounded-full animate-pulse scale-150"></div>
            
            {features.map((feature, idx) => {
                const isActive = idx === currentStep;
                const isPast = idx < currentStep;
                
                return (
                    <div 
                        key={feature.id}
                        className={`absolute transition-all duration-500 transform ${
                            isActive 
                                ? 'opacity-100 scale-100 translate-y-0' 
                                : isPast 
                                    ? 'opacity-0 scale-50 -translate-y-10' 
                                    : 'opacity-0 scale-50 translate-y-10'
                        }`}
                    >
                        <div className={`w-24 h-24 clay-card rounded-[24px] flex items-center justify-center shadow-xl ${feature.bg}`}>
                            <feature.icon className={`w-10 h-10 ${feature.color}`} />
                        </div>
                    </div>
                );
            })}
        </div>

        {/* Text Area */}
        <div className="text-center space-y-2 mb-12 h-16">
            <h2 className="text-2xl font-bold text-slate-800 transition-all duration-300">
                {activeFeature.text}
            </h2>
            <p className="text-slate-500 font-medium text-sm transition-all duration-300">
                {activeFeature.subtext}
            </p>
        </div>

        {/* Progress Indicators */}
        <div className="flex justify-center gap-3">
            {features.map((f, i) => (
                <div 
                    key={f.id} 
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                        i <= currentStep ? 'w-8 bg-emerald-500' : 'w-2 bg-slate-300'
                    }`}
                />
            ))}
        </div>

        {/* Version/Footer */}
        <div className="absolute -bottom-32 left-0 right-0 text-center">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">PlantDoc AI v1.0</p>
        </div>
      </div>
    </div>
  );
};
