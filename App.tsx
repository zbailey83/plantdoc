import React, { useState, useEffect } from 'react';
import { ViewState, Plant, DiagnosisResult, HealthStatus } from './types';
import { Navigation } from './components/Navigation';
import { PlantCard } from './components/PlantCard';
import { CameraView } from './components/CameraView';
import { DiagnosisResultView } from './components/DiagnosisResultView';
import { LeafIcon, UserIcon, PlusIcon, DropIcon } from './components/Icons';

// Mock weather data since we don't have an API key for the demo
const MOCK_WEATHER = {
  temp: 72,
  condition: "Sunny",
  humidity: 45
};

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('dashboard');
  const [plants, setPlants] = useState<Plant[]>([]);
  
  // State for the diagnosis flow
  const [diagnosisResult, setDiagnosisResult] = useState<DiagnosisResult | null>(null);
  const [diagnosisImage, setDiagnosisImage] = useState<string | null>(null);

  // Load plants from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('plantDoc_garden');
    if (saved) {
      try {
        setPlants(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved garden");
      }
    } else {
      // Seed data for empty state
      const seedData: Plant[] = [
        {
          id: '1',
          name: 'Monstera',
          species: 'Monstera deliciosa',
          imageUrl: 'https://picsum.photos/400/400?random=1',
          acquiredDate: new Date().toISOString(),
          status: HealthStatus.THRIVING,
          schedule: {
            waterFrequencyDays: 7,
            lastWatered: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), // 8 days ago (Overdue)
            nextWatering: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
          },
          diagnosisHistory: []
        }
      ];
      setPlants(seedData);
    }
  }, []);

  // Save plants whenever they change
  useEffect(() => {
    localStorage.setItem('plantDoc_garden', JSON.stringify(plants));
  }, [plants]);

  const handleDiagnosisComplete = (result: DiagnosisResult, image: string) => {
    setDiagnosisResult(result);
    setDiagnosisImage(image);
  };

  const handleSavePlant = (newPlant: Plant) => {
    setPlants(prev => [newPlant, ...prev]);
    setDiagnosisResult(null);
    setDiagnosisImage(null);
    setView('dashboard');
  };

  const handleWaterPlant = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setPlants(prev => prev.map(p => {
      if (p.id === id) {
        const nextDate = new Date();
        nextDate.setDate(nextDate.getDate() + p.schedule.waterFrequencyDays);
        return {
          ...p,
          schedule: {
            ...p.schedule,
            lastWatered: new Date().toISOString(),
            nextWatering: nextDate.toISOString()
          }
        };
      }
      return p;
    }));
  };

  // --- Views Rendering ---

  // 1. Diagnosis Result View (Overlay)
  if (diagnosisResult && diagnosisImage) {
    return (
      <DiagnosisResultView 
        result={diagnosisResult} 
        imageUrl={diagnosisImage} 
        onSave={handleSavePlant}
        onDiscard={() => {
          setDiagnosisResult(null);
          setDiagnosisImage(null);
        }}
      />
    );
  }

  // 2. Camera View
  if (view === 'camera') {
    return (
      <CameraView 
        onBack={() => setView('dashboard')} 
        onDiagnosisComplete={handleDiagnosisComplete}
      />
    );
  }

  // 3. Expert View (Monetization Placeholder)
  if (view === 'expert') {
    return (
      <div className="min-h-screen pb-32 max-w-md mx-auto relative px-6 pt-12">
         <div className="clay-card p-8 mb-8 bg-emerald-500/10 border-emerald-200">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Expert Help</h1>
            <p className="text-slate-600">Connect with certified botanists.</p>
         </div>
         
         <div className="space-y-6">
            <div className="clay-card p-6 text-center">
               <div className="w-24 h-24 clay-inset rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-600">
                 <LeafIcon className="w-10 h-10" />
               </div>
               <h2 className="text-2xl font-bold text-slate-800">Dr. Green Thumb</h2>
               <p className="text-emerald-600 font-medium mb-6">Senior Botanist • 15 Yrs Exp</p>
               
               <div className="clay-inset p-4 mb-6 mx-4">
                  <p className="text-3xl font-bold text-slate-800">$30<span className="text-base text-slate-400 font-medium">/hr</span></p>
               </div>
               
               <button className="w-full clay-btn-primary py-4 font-bold text-lg">
                 Book Now
               </button>
            </div>

            <div className="clay-card-sm p-5 border-l-8 border-yellow-400">
              <h3 className="font-bold text-slate-800 mb-1">Go Premium</h3>
              <p className="text-slate-600 text-sm">Subscribe for $9/mo to get unlimited AI diagnoses and priority support.</p>
            </div>
         </div>
         <Navigation currentView={view} onChange={setView} />
      </div>
    );
  }

  // 4. Dashboard (Default)
  return (
    <div className="min-h-screen pb-32 max-w-md mx-auto relative overflow-x-hidden">
      {/* Header & Weather */}
      <header className="px-6 pt-12 pb-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">My Garden</h1>
            <p className="text-slate-500 font-medium mt-1">Hello, Planter 🌱</p>
          </div>
          <div className="w-14 h-14 clay-card flex items-center justify-center">
            <UserIcon className="w-7 h-7 text-slate-700" />
          </div>
        </div>

        {/* Weather Widget */}
        <div className="clay-card p-6 relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-4 -translate-y-4">
              <div className="w-24 h-24 bg-yellow-400 rounded-full blur-2xl"></div>
           </div>
           
           <div className="flex justify-between items-end relative z-10">
             <div>
               <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Local Forecast</p>
               <div className="flex items-start gap-1">
                 <span className="text-5xl font-bold text-slate-800">{MOCK_WEATHER.temp}°</span>
                 <span className="text-emerald-500 font-bold mt-2">{MOCK_WEATHER.condition}</span>
               </div>
             </div>
             <div className="text-right">
               <div className="clay-inset px-4 py-2 rounded-xl">
                 <p className="text-xs text-slate-400 font-bold uppercase mb-1">Humidity</p>
                 <p className="text-xl font-bold text-slate-700">{MOCK_WEATHER.humidity}%</p>
               </div>
             </div>
           </div>
        </div>
      </header>

      {/* Plant List */}
      <main className="px-6">
        <div className="flex justify-between items-center mb-6 pl-1">
          <h2 className="text-xl font-bold text-slate-800">Your Plants</h2>
          <span className="clay-inset px-3 py-1 text-xs font-bold text-slate-500">{plants.length} Total</span>
        </div>

        {plants.length === 0 ? (
          <div className="clay-card p-10 text-center">
            <div className="w-20 h-20 clay-inset rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
              <LeafIcon className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-slate-700 mb-2">No plants yet</h3>
            <p className="text-slate-500 mb-8">Add your first plant to start tracking</p>
            <button 
              onClick={() => setView('camera')}
              className="clay-btn-secondary px-8 py-3 w-full font-bold flex items-center justify-center gap-2"
            >
              <PlusIcon className="w-5 h-5" /> Add Plant
            </button>
          </div>
        ) : (
          <div>
            {plants.map(plant => (
              <div key={plant.id} className="relative group">
                <PlantCard 
                  plant={plant} 
                  onClick={() => {/* Show detail */}} 
                />
                {/* Quick Action: Water */}
                <button 
                  onClick={(e) => handleWaterPlant(e, plant.id)}
                  className="absolute right-6 bottom-10 p-3 clay-btn-secondary rounded-full active:scale-95 transition-transform z-10"
                  title="Mark as Watered"
                >
                  <DropIcon className="w-6 h-6" />
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      <Navigation currentView={view} onChange={setView} />
    </div>
  );
};

export default App;