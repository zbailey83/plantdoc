
import React, { useState } from 'react';
import { LeafIcon, DropIcon, SearchIcon, SparklesIcon, ArrowLeftIcon } from './Icons';

interface FeatureLoaderProps {
  onComplete: () => void;
}

const features = [
  { 
    id: 1, 
    text: "Instant AI Diagnosis", 
    subtext: "Snap a photo to identify diseases and get expert treatment plans instantly.", 
    icon: SparklesIcon, 
    color: "text-purple-500", 
    bg: "bg-purple-100" 
  },
  { 
    id: 2, 
    text: "Your Personal Garden", 
    subtext: "Track all your plants in one beautiful, thriving digital space.", 
    icon: LeafIcon, 
    color: "text-emerald-600", 
    bg: "bg-emerald-100" 
  },
  { 
    id: 3, 
    text: "Smart Care Schedules", 
    subtext: "Never forget to water again with automated reminders tailored to each species.", 
    icon: DropIcon, 
    color: "text-blue-500", 
    bg: "bg-blue-100" 
  },
  { 
    id: 4, 
    text: "Extensive Database", 
    subtext: "Access detailed care guides and growing tips for over 500+ plant species.", 
    icon: SearchIcon, 
    color: "text-amber-500", 
    bg: "bg-amber-100" 
  },
];

export const FeatureLoader: React.FC<FeatureLoaderProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < features.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  const isLastStep = currentStep === features.length - 1;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#ecfdf5] overflow-hidden">
        {/* Skip Button - Fixed Top Right */}
        <div className="absolute top-0 right-0 p-6 z-20">
            <button 
              onClick={onComplete}
              className="px-4 py-2 rounded-full bg-white/50 backdrop-blur-md text-slate-500 font-bold text-xs hover:bg-white/80 transition-all shadow-sm"
            >
              SKIP
            </button>
        </div>

        {/* Main Content Area - Grow to fill space */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 relative w-full max-w-md mx-auto">
            
            {/* Animation/Icon Area */}
            <div className="relative w-full h-64 sm:h-80 flex items-center justify-center mb-8">
                {/* Animated Rings Background */}
                <div className="absolute inset-0 bg-emerald-400/20 blur-3xl rounded-full animate-pulse scale-125"></div>
                
                {features.map((feature, idx) => {
                    // Animation Logic
                    let transformClass = 'opacity-0 scale-50 translate-x-32'; // Future slide (right)
                    
                    if (idx === currentStep) {
                        transformClass = 'opacity-100 scale-100 translate-x-0'; // Current slide
                    } else if (idx < currentStep) {
                        transformClass = 'opacity-0 scale-50 -translate-x-32'; // Past slide (left)
                    }
                    
                    return (
                        <div 
                            key={feature.id}
                            className={`absolute transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) transform ${transformClass}`}
                        >
                            <div className={`w-36 h-36 sm:w-48 sm:h-48 clay-card rounded-[32px] flex items-center justify-center shadow-2xl ${feature.bg}`}>
                                <feature.icon className={`w-16 h-16 sm:w-24 sm:h-24 ${feature.color}`} />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Text Area */}
            <div className="w-full relative h-32 text-center">
                {features.map((feature, idx) => (
                     <div 
                        key={feature.id} 
                        className={`absolute inset-0 flex flex-col items-center transition-all duration-500 px-2 ${
                            idx === currentStep ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
                        }`}
                    >
                        <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-3 leading-tight">
                            {feature.text}
                        </h2>
                        <p className="text-slate-500 font-medium text-base sm:text-lg leading-relaxed max-w-xs mx-auto">
                            {feature.subtext}
                        </p>
                    </div>
                ))}
            </div>
        </div>

        {/* Footer Area - Fixed height/spacing */}
        <div className="px-8 pb-10 pt-4 flex items-center justify-between w-full max-w-md mx-auto">
             {/* Indicators */}
             <div className="flex gap-2.5">
                {features.map((_, i) => (
                    <div
                        key={i} 
                        className={`h-2.5 rounded-full transition-all duration-300 ${
                            i === currentStep ? 'w-8 bg-emerald-500 shadow-sm' : 'w-2.5 bg-slate-300'
                        }`}
                    />
                ))}
            </div>

            {/* Next Button */}
            <button 
                onClick={handleNext}
                className={`clay-btn-primary flex items-center justify-center shadow-xl active:scale-95 transition-all duration-300 group ${
                    isLastStep ? 'px-6 py-3 rounded-2xl' : 'w-14 h-14 rounded-full'
                }`}
            >
                {isLastStep ? (
                    <span className="font-bold text-sm whitespace-nowrap flex items-center gap-2">
                        Enter Garden <ArrowLeftIcon className="w-4 h-4 rotate-180" />
                    </span>
                ) : (
                    <ArrowLeftIcon className="w-6 h-6 rotate-180 group-hover:translate-x-1 transition-transform" />
                )}
            </button>
        </div>
    </div>
  );
};
