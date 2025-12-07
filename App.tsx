import React, { useState, useEffect } from 'react';
import { ViewState, Plant, DiagnosisResult, HealthStatus } from './types';
import { Navigation } from './components/Navigation';
import { PlantCard } from './components/PlantCard';
import { CameraView } from './components/CameraView';
import { DiagnosisResultView } from './components/DiagnosisResultView';
import { PlantDetailView } from './components/PlantDetailView';
import { ExpertView } from './components/ExpertView';
import { SplashScreen } from './components/SplashScreen';
import { SettingsView } from './components/SettingsView';
import { UserIcon, PlusIcon, DropIcon, LeafIcon } from './components/Icons';

// Mock weather data
const MOCK_WEATHER = {
  temp: 72,
  condition: "Sunny",
  humidity: 45
};

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [view, setView] = useState<ViewState>('dashboard');
  const [plants, setPlants] = useState<Plant[]>([]);
  const [selectedPlantId, setSelectedPlantId] = useState<string | null>(null);
  
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
          imageUrl: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&q=80&w=800',
          acquiredDate: new Date().toISOString(),
          status: HealthStatus.THRIVING,
          schedule: {
            waterFrequencyDays: 7,
            lastWatered: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), // 8 days ago (Overdue)
            nextWatering: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            mistFrequencyDays: 3,
            lastMisted: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
            nextMisting: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            fertilizeFrequencyDays: 30,
            lastFertilized: new Date().toISOString(),
            nextFertilizing: new Date(Date.now() + 29 * 24 * 60 * 60 * 1000).toISOString(),
          },
          diagnosisHistory: []
        },
        {
          id: '2',
          name: 'Snake Plant',
          species: 'Sansevieria trifasciata',
          imageUrl: 'https://images.unsplash.com/photo-1593482886875-6647f38fa83f?auto=format&fit=crop&q=80&w=800',
          acquiredDate: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000).toISOString(),
          status: HealthStatus.THRIVING,
          schedule: {
            waterFrequencyDays: 14,
            lastWatered: new Date().toISOString(),
            nextWatering: new Date(Date.now() + 13 * 24 * 60 * 60 * 1000).toISOString(),
            mistFrequencyDays: 0, // Not needed
            fertilizeFrequencyDays: 60,
            lastFertilized: new Date(Date.now() - 61 * 24 * 60 * 60 * 1000).toISOString(),
            nextFertilizing: new Date().toISOString(),
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

  const handleUpdatePlant = (updatedPlant: Plant) => {
      setPlants(prev => prev.map(p => p.id === updatedPlant.id ? updatedPlant : p));
  };

  const handleDeletePlant = (id: string) => {
    setPlants(prev => prev.filter(p => p.id !== id));
    setSelectedPlantId(null);
    setView('dashboard');
  };

  // Generic handler for marking care tasks as done
  const updateScheduleDate = (id: string, type: 'water' | 'mist' | 'fertilize') => {
      setPlants(prev => prev.map(p => {
        if (p.id !== id) return p;

        const now = new Date();
        const schedule = { ...p.schedule };
        
        if (type === 'water') {
            const freq = schedule.waterFrequencyDays;
            schedule.lastWatered = now.toISOString();
            schedule.nextWatering = new Date(now.getTime() + freq * 24 * 60 * 60 * 1000).toISOString();
        } else if (type === 'mist') {
            const freq = schedule.mistFrequencyDays || 0;
            if (freq > 0) {
                schedule.lastMisted = now.toISOString();
                schedule.nextMisting = new Date(now.getTime() + freq * 24 * 60 * 60 * 1000).toISOString();
            }
        } else if (type === 'fertilize') {
            const freq = schedule.fertilizeFrequencyDays || 0;
            if (freq > 0) {
                schedule.lastFertilized = now.toISOString();
                schedule.nextFertilizing = new Date(now.getTime() + freq * 24 * 60 * 60 * 1000).toISOString();
            }
        }

        return { ...p, schedule };
      }));
  };

  // --- Views Rendering ---

  if (showSplash) {
      return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

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

  // 3. Expert View
  if (view === 'expert') {
    return <ExpertView currentView={view} onChangeView={setView} />;
  }

  // 4. Plant Detail View
  if (selectedPlantId) {
    const plant = plants.find(p => p.id === selectedPlantId);
    if (plant) {
        return (
            <PlantDetailView 
                plant={plant} 
                onBack={() => setSelectedPlantId(null)}
                onDelete={handleDeletePlant}
                onWater={() => updateScheduleDate(plant.id, 'water')}
                onMist={() => updateScheduleDate(plant.id, 'mist')}
                onFertilize={() => updateScheduleDate(plant.id, 'fertilize')}
                onUpdate={handleUpdatePlant}
            />
        );
    }
  }

  // 5. Dashboard (Default)
  return (
    <div className="min-h-screen pb-32 max-w-md mx-auto relative overflow-x-hidden">
      
      {showSettings && <SettingsView onClose={() => setShowSettings(false)} />}

      {/* Header & Weather */}
      <header className="px-6 pt-12 pb-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">My Garden</h1>
            <p className="text-slate-500 font-medium mt-1">Hello, Planter 🌱</p>
          </div>
          <button 
            onClick={() => setShowSettings(true)}
            className="w-14 h-14 clay-card flex items-center justify-center active:scale-95 transition-transform"
          >
            <UserIcon className="w-7 h-7 text-slate-700" />
          </button>
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
                  onClick={() => setSelectedPlantId(plant.id)} 
                />
                {/* Quick Action: Water */}
                <button 
                  onClick={(e) => {
                      e.stopPropagation();
                      updateScheduleDate(plant.id, 'water');
                  }}
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