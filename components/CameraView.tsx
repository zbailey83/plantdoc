import React, { useState, useRef, useEffect } from 'react';
import { diagnosePlantImage, fileToGenerativePart } from '../services/geminiService';
import { DiagnosisResult } from '../types';
import { ArrowLeftIcon, AlertIcon, CameraIcon, SwitchCameraIcon, ImageIcon } from './Icons';

interface CameraViewProps {
  onBack: () => void;
  onDiagnosisComplete: (result: DiagnosisResult, image: string) => void;
}

export const CameraView: React.FC<CameraViewProps> = ({ onBack, onDiagnosisComplete }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Initialize Camera
  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [facingMode]);

  const startCamera = async () => {
    if (preview) return; // Don't start if we have a captured image
    
    stopCamera();
    try {
      const constraints = {
        video: { 
          facingMode: facingMode,
          // width/height ideal for mobile portrait often differs, keeping generic
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
            setIsStreaming(true);
            setError(null);
            videoRef.current?.play().catch(e => console.error("Play error:", e));
        };
      }
    } catch (err) {
      console.warn("Camera access failed or denied:", err);
      setIsStreaming(false);
      // Don't show error immediately, UI will show fallback upload state naturally
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      setIsStreaming(false);
    }
  };

  const toggleCamera = () => {
    setFacingMode(prev => prev === 'environment' ? 'user' : 'environment');
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Set canvas to match video dimensions
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Draw video frame to canvas
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert to base64
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setPreview(dataUrl);
        stopCamera();
      }
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const base64Data = await fileToGenerativePart(file);
      const imageUrl = `data:image/jpeg;base64,${base64Data}`; // For preview
      setPreview(imageUrl);
      stopCamera();
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

  const handleRetake = () => {
    setPreview(null);
    setError(null);
    startCamera();
  };

  return (
    <div className="h-full min-h-screen flex flex-col bg-black relative overflow-hidden">
      {/* Hidden Canvas for Capture */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-6 pt-8 z-30 flex items-center justify-between bg-gradient-to-b from-black/60 to-transparent">
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white border border-white/20 active:scale-95 transition-transform">
          <ArrowLeftIcon className="w-6 h-6" />
        </button>
        <span className="text-white font-bold tracking-widest text-sm uppercase bg-black/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
          AI Diagnostic
        </span>
        <button onClick={toggleCamera} disabled={!!preview || !isStreaming} className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white border border-white/20 active:scale-95 transition-transform disabled:opacity-0">
          <SwitchCameraIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Main Viewport */}
      <div className="flex-1 relative bg-gray-900 overflow-hidden">
        
        {/* Video Layer - Always rendered to ensure ref exists */}
        <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted 
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${isStreaming && !preview ? 'opacity-100' : 'opacity-0'}`}
        />

        {/* State: Preview Image */}
        {preview && (
          <img src={preview} alt="Preview" className="absolute inset-0 w-full h-full object-cover z-20" />
        )}

        {/* State: No Camera (Fallback) - Only shown if not streaming and no preview */}
        {!isStreaming && !preview && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-gray-900 z-10">
            <div className="w-24 h-24 rounded-full bg-gray-800 flex items-center justify-center mb-6">
               <CameraIcon className="w-10 h-10 text-gray-500" />
            </div>
            <h3 className="text-white text-xl font-bold mb-2">Camera Unavailable</h3>
            <p className="text-gray-400 mb-8 max-w-xs">We couldn't access your camera. You can still upload a photo from your gallery.</p>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="clay-btn-primary px-8 py-3 font-bold flex items-center gap-2"
            >
              <ImageIcon className="w-5 h-5" /> Upload Photo
            </button>
          </div>
        )}

        {/* OVERLAYS */}
        
        {/* 1. Viewfinder Overlay (Visible when streaming or previewing before analysis) */}
        {!analyzing && (isStreaming || preview) && (
          <div className="absolute inset-0 pointer-events-none z-10 flex flex-col items-center justify-center">
             {/* Darkened edges */}
             <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]"></div>
             
             {/* Frame Corners */}
             <div className="relative w-64 h-64 sm:w-80 sm:h-80 opacity-80 transition-all duration-300">
                {/* Top Left */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-lg shadow-sm"></div>
                {/* Top Right */}
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-lg shadow-sm"></div>
                {/* Bottom Left */}
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-lg shadow-sm"></div>
                {/* Bottom Right */}
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-lg shadow-sm"></div>
                
                {/* Grid Lines (Subtle) */}
                <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
                   <div className="border-r border-b border-white/20"></div>
                   <div className="border-b border-white/20"></div>
                   <div className="border-r border-white/20"></div>
                </div>

                {/* Focus Indicator */}
                {!preview && (
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white/50 rounded-full animate-pulse"></div>
                )}
             </div>
             
             {/* Hint Text */}
             <div className="absolute bottom-32 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
               <p className="text-white text-xs font-bold tracking-wide">
                 {preview ? "Review Photo" : "Align plant within frame"}
               </p>
             </div>
          </div>
        )}

        {/* 2. Analysis Scanner Overlay (Active during analysis) */}
        {analyzing && (
          <div className="absolute inset-0 z-20 flex flex-col">
            {/* Scanning Line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-[#32CD32] shadow-[0_0_20px_#32CD32] animate-[scan_2s_linear_infinite] z-30 opacity-80"></div>
            
            {/* Sci-Fi Grid Background */}
            <div className="absolute inset-0 bg-[#32CD32]/5 z-10 grid grid-cols-6 grid-rows-6">
                {[...Array(36)].map((_, i) => (
                    <div key={i} className="border border-[#32CD32]/10"></div>
                ))}
            </div>

            {/* Processing Badge */}
            <div className="absolute inset-0 flex items-center justify-center z-40">
               <div className="bg-black/70 backdrop-blur-xl px-8 py-6 rounded-3xl border border-[#32CD32]/30 flex flex-col items-center gap-4 animate-pulse">
                  <div className="relative w-12 h-12">
                     <div className="absolute inset-0 border-4 border-t-[#32CD32] border-r-[#32CD32] border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                  </div>
                  <div className="text-center">
                     <h3 className="text-[#32CD32] font-bold text-lg tracking-wider">ANALYZING</h3>
                     <p className="text-white/60 text-xs font-bold mt-1">Identifying Issues...</p>
                  </div>
               </div>
            </div>
          </div>
        )}
      </div>

      {/* Control Bar */}
      <div className="bg-white rounded-t-[32px] p-8 pb-10 shadow-[0_-10px_40px_rgba(0,0,0,0.2)] relative z-40">
        <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mb-8"></div>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm flex items-center gap-3 font-bold border border-red-100">
            <AlertIcon className="w-5 h-5 shrink-0" />
            {error}
          </div>
        )}

        {!preview ? (
           <div className="flex items-center justify-around">
              {/* Gallery Button */}
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600 active:scale-95 transition-transform hover:bg-slate-200"
              >
                <ImageIcon className="w-6 h-6" />
              </button>

              {/* Shutter Button */}
              <button 
                 onClick={capturePhoto}
                 disabled={!isStreaming}
                 className="w-20 h-20 rounded-full border-4 border-[#32CD32] p-1 shadow-lg active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
              >
                 <div className="w-full h-full bg-[#32CD32] rounded-full"></div>
              </button>

              {/* Spacer for symmetry */}
              <div className="w-14 h-14"></div>
           </div>
        ) : (
          <div className="flex gap-4">
             <button 
              onClick={handleRetake}
              disabled={analyzing}
              className="flex-1 py-4 font-bold text-slate-500 hover:text-slate-800 transition-colors disabled:opacity-50"
            >
              Retake
            </button>
            <button 
              onClick={handleAnalyze}
              disabled={analyzing}
              className="flex-[2] clay-btn-primary py-4 font-bold text-lg disabled:opacity-80 disabled:cursor-not-allowed shadow-xl"
            >
              Diagnose
            </button>
          </div>
        )}
        
        {/* Hidden File Input */}
        <input 
          type="file" 
          ref={fileInputRef} 
          accept="image/*" 
          className="hidden" 
          onChange={handleFileChange}
        />
      </div>

      <style>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
};