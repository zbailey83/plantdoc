import React, { useState } from 'react';
import { ViewState } from '../types';
import { Navigation } from './Navigation';
import { LeafIcon, CheckIcon } from './Icons';

interface ExpertViewProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
}

export const ExpertView: React.FC<ExpertViewProps> = ({ currentView, onChangeView }) => {
  const [isPremium, setIsPremium] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);

  const handleBooking = () => {
    setShowBookingModal(true);
    setTimeout(() => {
        setShowBookingModal(false);
        alert("Consultation request sent! Dr. Green Thumb will message you shortly.");
    }, 2000);
  };

  return (
    <div className="min-h-screen pb-32 max-w-md mx-auto relative px-6 pt-12">
        {/* Header */}
         <div className="clay-card p-8 mb-8 bg-gradient-to-br from-emerald-50 to-white border-white/50">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Expert Help</h1>
            <p className="text-slate-600">Connect with certified botanists for 1-on-1 video advice.</p>
         </div>
         
         <div className="space-y-6">
            {/* Botanist Profile */}
            <div className="clay-card p-6 text-center relative overflow-hidden">
               <div className="w-24 h-24 clay-inset rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-600 border-4 border-white shadow-sm">
                 <LeafIcon className="w-10 h-10" />
               </div>
               <div className="absolute top-4 right-4 bg-emerald-100 text-emerald-600 px-2 py-1 rounded-lg text-xs font-bold">Online</div>
               
               <h2 className="text-2xl font-bold text-slate-800">Dr. Green Thumb</h2>
               <p className="text-slate-500 font-medium mb-6 text-sm">Senior Botanist • PhD in Plant Pathology</p>
               
               <div className="flex justify-center gap-4 mb-6">
                    <div className="clay-inset px-4 py-2">
                        <p className="font-bold text-slate-700">4.9 ★</p>
                        <p className="text-[10px] uppercase text-slate-400 font-bold">Rating</p>
                    </div>
                    <div className="clay-inset px-4 py-2">
                        <p className="font-bold text-slate-700">500+</p>
                        <p className="text-[10px] uppercase text-slate-400 font-bold">Helped</p>
                    </div>
               </div>
               
               <div className="flex items-center justify-between bg-slate-50 rounded-2xl p-4 mb-6 border border-slate-100">
                  <span className="text-slate-500 font-medium">Video Call Rate</span>
                  <p className="text-xl font-bold text-slate-800">$30<span className="text-base text-slate-400 font-medium">/hr</span></p>
               </div>
               
               <button 
                 onClick={handleBooking}
                 disabled={showBookingModal}
                 className="w-full clay-btn-primary py-4 font-bold text-lg flex items-center justify-center gap-2"
               >
                 {showBookingModal ? 'Scheduling...' : 'Book Consultation'}
               </button>
            </div>

            {/* Premium Toggle */}
            <div className={`clay-card-sm p-6 border-l-8 transition-colors duration-500 ${isPremium ? 'border-purple-500 bg-purple-50' : 'border-yellow-400'}`}>
              <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-slate-800 text-lg mb-1">{isPremium ? 'Premium Active' : 'Go Premium'}</h3>
                    <p className="text-slate-600 text-sm">{isPremium ? 'You have access to all advanced features.' : 'Get unlimited AI diagnoses & priority support.'}</p>
                  </div>
                  <button 
                    onClick={() => setIsPremium(!isPremium)}
                    className={`w-12 h-7 rounded-full p-1 transition-colors duration-300 ${isPremium ? 'bg-purple-500' : 'bg-slate-300'}`}
                  >
                      <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${isPremium ? 'translate-x-5' : 'translate-x-0'}`}></div>
                  </button>
              </div>
              
              {!isPremium && (
                  <div className="mt-4 pt-4 border-t border-slate-200/50">
                    <p className="text-center font-bold text-slate-800">$9.00 / month</p>
                  </div>
              )}
            </div>
         </div>

         {/* Navigation */}
         <Navigation currentView={currentView} onChange={onChangeView} />
      </div>
  );
};