import React, { useState, useRef } from 'react';
import { diagnosePlantImage, fileToGenerativePart } from '../services/geminiService';
import { DiagnosisResult } from '../types';
import { ArrowLeftIcon, AlertIcon, CameraIcon } from './Icons';

interface CameraViewProps {
  onBack: () => void;
  onDiagnosisComplete: (result: DiagnosisResult, image: string) => void;
}

export const CameraView: React.FC<CameraViewProps> = ({ onBack, onDiagnosisComplete }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const base64Data = await fileToGenerativePart(file);
      const imageUrl = `data:image/jpeg;base64,${base64Data}`; // For preview
      setPreview(imageUrl);
      setError(null);
    } catch (err) {
      setError("Failed to process image.");
    }
  };

  const handleAnalyze = async () => {
    if (!preview) return;
    setAnalyzing(true);
    setError(null);
    try {
      // Extract base64 raw data from the preview URL
      const rawBase64 = preview.split(',')[1];
      const result = await diagnosePlantImage(rawBase64);
      onDiagnosisComplete(result, preview);
    } catch (err: any) {
      setError(err.message || "Diagnostic failed. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="h-full min-h-screen flex flex-col bg-[#2d2d3a] relative overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-6 z-20 flex items-center justify-between">
        <button onClick={onBack} className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white shadow-lg active:scale-95 transition-transform">
          <ArrowLeftIcon className="w-6 h-6" />
        </button>
        <span className="text-white font-quicksand font-bold tracking-wider">SCANNER</span>
        <div className="w-12" /> {/* Spacer */}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center relative">
        {preview ? (
          <div className="w-full h-full relative">
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
             {/* Scanning Overlay Effect */}
            {analyzing && (
              <div className="absolute inset-0 bg-emerald-500/10 z-20 backdrop-blur-[2px]">
                <div className="w-full h-2 bg-emerald-400 shadow-[0_0_30px_rgba(52,211,153,1)] animate-[scan_2s_ease-in-out_infinite]" />
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="clay-card px-6 py-4 flex items-center gap-3 animate-pulse">
                      <div className="w-3 h-3 bg-emerald-500 rounded-full animate-bounce"></div>
                      <span className="font-bold text-slate-700">Analyzing Plant...</span>
                   </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center p-8 w-full max-w-xs">
            <div className="aspect-square w-full rounded-[40px] border-4 border-dashed border-white/20 mb-8 flex items-center justify-center bg-white/5 backdrop-blur-sm">
              <CameraIcon className="w-20 h-20 text-white/50" />
            </div>
            <p className="text-white/60 font-medium text-lg">Position plant in frame</p>
          </div>
        )}

        <style>{`
          @keyframes scan {
            0% { transform: translateY(0); }
            50% { transform: translateY(100vh); }
            100% { transform: translateY(0); }
          }
        `}</style>
      </div>

      {/* Control Bar */}
      <div className="bg-[#ecfdf5] rounded-t-[40px] p-8 pb-12 shadow-[0_-10px_40px_rgba(0,0,0,0.2)] relative z-30">
        <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mb-8 opacity-50"></div>
        
        {error && (
          <div className="bg-red-100 text-red-600 p-4 rounded-2xl mb-6 text-sm flex items-center gap-3 font-medium">
            <AlertIcon className="w-5 h-5" />
            {error}
          </div>
        )}

        {!preview ? (
           <button 
             onClick={() => fileInputRef.current?.click()}
             className="w-full clay-btn-primary py-5 text-xl font-bold tracking-wide"
           >
             Capture Photo
           </button>
        ) : (
          <div className="flex gap-4">
             <button 
              onClick={() => { setPreview(null); setError(null); }}
              disabled={analyzing}
              className="flex-1 clay-btn-secondary py-4 font-bold text-lg"
            >
              Retake
            </button>
            <button 
              onClick={handleAnalyze}
              disabled={analyzing}
              className="flex-1 clay-btn-primary py-4 font-bold text-lg disabled:opacity-80 disabled:cursor-not-allowed"
            >
              Diagnose
            </button>
          </div>
        )}
        
        <input 
          type="file" 
          ref={fileInputRef} 
          accept="image/*" 
          capture="environment" 
          className="hidden" 
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
};