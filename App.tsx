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
import { useAuth } from './contexts/AuthContext';
import { LoginView } from './components/LoginView';
import { supabase } from './services/supabaseClient';

interface WeatherData {
  temp: number;
  condition: string;
  humidity: number;
  city: string;
  date: string;
  day: string;
}

const App: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const [showSplash, setShowSplash] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [view, setView] = useState<ViewState>('dashboard');
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loadingPlants, setLoadingPlants] = useState(false);
  
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

  // Fetch Plants from Supabase
  useEffect(() => {
    if (user && !showSplash) {
      const fetchPlants = async () => {
        setLoadingPlants(true);
        try {
          const { data, error } = await supabase
            .from('plants')
            .select('*')
            .order('created_at', { ascending: false });

          if (error) throw error;

          // Transform snake_case DB fields to camelCase TS interface if needed
          // Since we stored complex objects (schedule, diagnosisHistory) as JSONB, they come back as objects
          const loadedPlants: Plant[] = (data || []).map((p: any) => ({
             id: p.id,
             name: p.name,
             species: p.species,
             imageUrl: p.image_url,
             acquiredDate: p.acquired_date,
             status: p.status as HealthStatus,
             schedule: p.schedule,
             diagnosisHistory: p.diagnosis_history || []
          }));

          setPlants(loadedPlants);
        } catch (error) {
          console.error('Error fetching plants:', error);
        } finally {
          setLoadingPlants(false);
        }
      };

      fetchPlants();
    }
  }, [user, showSplash]);

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

  const handleSavePlant = async (newPlant: Plant) => {
    if (!user) return;
    
    // Optimistic Update
    setPlants(prev => [newPlant, ...prev]);
    setDiagnosisResult(null);
    setDiagnosisImage(null);
    setView('dashboard');

    try {
        const { data, error } = await supabase.from('plants').insert({
            user_id: user.id,
            name: newPlant.name,
            species: newPlant.species,
            image_url: newPlant.imageUrl,
            acquired_date: newPlant.acquiredDate,
            status: newPlant.status,
            schedule: newPlant.schedule,
            diagnosis_history: newPlant.diagnosisHistory
        }).select().single();

        if (error) throw error;
        
        // Update with real ID from DB
        setPlants(prev => prev.map(p => p.id === newPlant.id ? { ...p, id: data.id } : p));

    } catch (err) {
        console.error("Error saving plant:", err);
        // Revert on failure
        setPlants(prev => prev.filter(p => p.id !== newPlant.id));
        alert("Failed to save plant to cloud.");
    }
  };

  const handleUpdatePlant = async (updatedPlant: Plant) => {
      setPlants(prev => prev.map(p => p.id === updatedPlant.id ? updatedPlant : p));
      
      try {
          const { error } = await supabase.from('plants').update({
            name: updatedPlant.name,
            schedule: updatedPlant.schedule
            // We usually don't update image/species after creation in this simple flow, but could be added
          }).eq('id', updatedPlant.id);

          if (error) throw error;
      } catch (err) {
          console.error("Error updating plant:", err);
      }
  };

  const handleDeletePlant = async (id: string) => {
    setPlants(prev => prev.filter(p => p.id !== id));
    setSelectedPlantId(null);
    setView('dashboard');

    try {
        const { error } = await supabase.from('plants').delete().eq('id', id);
        if (error) throw error;
    } catch (err) {
        console.error("Error deleting plant:", err);
    }
  };

  const handleAddSpecies = async (species: Species) => {
    const now = new Date();
    
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
        id: Date.now().toString(), // Temp ID
        name: species.commonName,
        species: species.scientificName,
        imageUrl: species.imageUrl,
        acquiredDate: now.toISOString(),
        status: HealthStatus.THRIVING,
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
    
    // Use the save handler to persist to DB
    handleSavePlant(newPlant);
    setSelectedSpecies(null);
    setView('dashboard');
  };

  // Generic handler for marking care tasks as done
  const updateScheduleDate = async (id: string, type: 'water' | 'mist' | 'fertilize') => {
      const plant = plants.find(p => p.id === id);
      if (!plant) return;

      const now = new Date();
      const schedule = { ...plant.schedule };
      
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

      // Optimistic update
      const updatedPlant = { ...plant, schedule };
      setPlants(prev => prev.map(p => p.id === id ? updatedPlant : p));

      // Persist
      try {
          const { error } = await supabase
            .from('plants')
            .update({ schedule: schedule })
            .eq('id', id);
          if (error) throw error;
      } catch (err) {
          console.error("Error updating schedule:", err);
      }
  };

  // --- Views Rendering ---

  if (authLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#ecfdf5]">
             <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      );
  }

  // Auth Guard
  if (!user) {
      return <LoginView />;
  }

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
          <span className="clay-inset px-3 py-1 text-xs font-bold text-slate-500">
             {loadingPlants ? '...' : `${plants.length} Total`}
          </span>
        </div>

        {loadingPlants ? (
           <div className="flex flex-col gap-4">
               {[1, 2].map(i => (
                   <div key={i} className="clay-card h-32 animate-pulse opacity-50"></div>
               ))}
           </div>
        ) : plants.length === 0 ? (
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