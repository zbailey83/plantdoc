import React, { useState, useEffect } from 'react';
import { ViewState, Plant, DiagnosisResult, HealthStatus, Species } from './types';
import { Navigation } from './components/Navigation';
import { PlantCard } from './components/PlantCard';
import { CameraView } from './components/CameraView';
import { DiagnosisResultView } from './components/DiagnosisResultView';
import { PlantDetailView } from './components/PlantDetailView';
import { ExpertView } from './components/ExpertView';
import { SplashScreen } from './components/SplashScreen';
import { SettingsView } from './components/SettingsView';
import { PlantDatabaseView } from './components/PlantDatabaseView';
import { SpeciesDetailView } from './components/SpeciesDetailView';
import { UserIcon, PlusIcon, DropIcon, LeafIcon } from './components/Icons';

interface WeatherData {
  temp: number;
  condition: string;
  humidity: number;
  city: string;
  date: string;
  day: string;
}

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [view, setView] = useState<ViewState>('dashboard');
  const [plants, setPlants] = useState<Plant[]>([]);
  const [selectedPlantId, setSelectedPlantId] = useState<string | null>(null);
  const [selectedSpecies, setSelectedSpecies] = useState<Species | null>(null);
  
  // State for the diagnosis flow
  const [diagnosisResult, setDiagnosisResult] = useState<DiagnosisResult | null>(null);
  const [diagnosisImage, setDiagnosisImage] = useState<string | null>(null);

  // Weather State
  const [weather, setWeather] = useState<WeatherData>({
    temp: 72,
    condition: "Sunny",
    humidity: 45,
    city: "My Garden",
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    day: new Date().toLocaleDateString('en-US', { weekday: 'long' })
  });

  // Load plants from local storage on mount (Updated key for rebranding)
  useEffect(() => {
    // Check old key first to migrate data
    const oldSaved = localStorage.getItem('plantDoc_garden');
    const newSaved = localStorage.getItem('verdant_garden');
    
    if (newSaved) {
      try {
        setPlants(JSON.parse(newSaved));
      } catch (e) { console.error("Failed to parse"); }
    } else if (oldSaved) {
       // Migration
       try {
        const data = JSON.parse(oldSaved);
        setPlants(data);
        localStorage.setItem('verdant_garden', JSON.stringify(data));
       } catch (e) { console.error("Failed migration"); }
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
    localStorage.setItem('verdant_garden', JSON.stringify(plants));
  }, [plants]);

  // Weather Fetching
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        
        try {
          // 1. Fetch Weather Data (Open-Meteo - Free, No Key)
          const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code&temperature_unit=fahrenheit`);
          const weatherData = await weatherRes.json();
          
          // Map WMO codes to conditions
          const getCondition = (code: number) => {
             if (code === 0) return "Sunny";
             if (code >= 1 && code <= 3) return "Cloudy";
             if (code >= 45 && code <= 48) return "Foggy";
             if (code >= 51 && code <= 67) return "Rainy";
             if (code >= 71 && code <= 77) return "Snowy";
             if (code >= 80 && code <= 82) return "Showers";
             if (code >= 95) return "Stormy";
             return "Clear";
          };

          // 2. Fetch City Name (Reverse Geocoding - BigDataCloud Free API)
          // Using a free endpoint to avoid keys, fallback to generic if fails
          let city = "Local Garden";
          try {
             const geoRes = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`);
             const geoData = await geoRes.json();
             if (geoData.city || geoData.locality) {
                city = geoData.city || geoData.locality;
             }
          } catch (e) { console.warn("Geo fetch failed", e); }

          setWeather({
             temp: Math.round(weatherData.current.temperature_2m),
             condition: getCondition(weatherData.current.weather_code),
             humidity: weatherData.current.relative_humidity_2m,
             city: city,
             date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
             day: new Date().toLocaleDateString('en-US', { weekday: 'long' })
          });

        } catch (error) {
           console.error("Weather update failed", error);
        }
      });
    }
  }, []);

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

  const handleAddSpecies = (species: Species) => {
    const now = new Date();
    
    // Calculate initial next dates based on defaults
    const waterFreq = species.suggestedWaterFrequency || 7;
    const nextWatering = new Date(now.getTime() + waterFreq * 24 * 60 * 60 * 1000).toISOString();
    
    const mistFreq = species.suggestedMistFrequency || 0;
    const nextMisting = mistFreq > 0 
        ? new Date(now.getTime() + mistFreq * 24 * 60 * 60 * 1000).toISOString()
        : undefined;

    const fertFreq = species.suggestedFertilizeFrequency || 0;
    const nextFertilizing = fertFreq > 0
        ? new Date(now.getTime() + fertFreq * 24 * 60 * 60 * 1000).toISOString()
        : undefined;

    const newPlant: Plant = {
        id: Date.now().toString(),
        name: species.commonName,
        species: species.scientificName,
        imageUrl: species.imageUrl,
        acquiredDate: now.toISOString(),
        status: HealthStatus.THRIVING, // Assume healthy when adding from DB
        diagnosisHistory: [],
        schedule: {
            waterFrequencyDays: waterFreq,
            lastWatered: now.toISOString(),
            nextWatering: nextWatering,
            mistFrequencyDays: mistFreq,
            lastMisted: mistFreq > 0 ? now.toISOString() : undefined,
            nextMisting: nextMisting,
            fertilizeFrequencyDays: fertFreq,
            lastFertilized: fertFreq > 0 ? now.toISOString() : undefined,
            nextFertilizing: nextFertilizing
        }
    };
    
    setPlants(prev => [newPlant, ...prev]);
    setSelectedSpecies(null);
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

  // 4. Database View (Search)
  if (view === 'database') {
      if (selectedSpecies) {
          return (
            <SpeciesDetailView 
                species={selectedSpecies} 
                onBack={() => setSelectedSpecies(null)}
                onAdd={handleAddSpecies}
            />
          );
      }
      return (
        <PlantDatabaseView 
            currentView={view} 
            onChangeView={setView} 
            onSelectSpecies={setSelectedSpecies}
        />
      );
  }

  // 5. Plant Detail View
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

  // 6. Dashboard (Default)
  return (
    <div className="min-h-screen pb-32 max-w-md mx-auto relative overflow-x-hidden">
      
      {showSettings && <SettingsView onClose={() => setShowSettings(false)} />}

      {/* Header & Weather */}
      <header className="px-6 pt-12 pb-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#064E3B] tracking-tight">Verdant</h1>
            <p className="text-[#059669] font-medium mt-1">Grow with confidence.</p>
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
               {/* Location & Date */}
               <div className="mb-4">
                 <p className="text-slate-800 text-lg font-bold flex items-center gap-1">
                   {weather.city}
                 </p>
                 <p className="text-emerald-600 text-sm font-bold opacity-80 uppercase tracking-wide">
                   {weather.day}, {weather.date}
                 </p>
               </div>

               <div className="flex items-start gap-1">
                 <span className="text-5xl font-bold text-slate-800">{weather.temp}°</span>
                 <span className="text-emerald-500 font-bold mt-2">{weather.condition}</span>
               </div>
             </div>
             <div className="text-right">
               <div className="clay-inset px-4 py-2 rounded-xl">
                 <p className="text-xs text-slate-400 font-bold uppercase mb-1">Humidity</p>
                 <p className="text-xl font-bold text-slate-700">{weather.humidity}%</p>
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