import React from 'react';
import { motion } from 'framer-motion';
import { Mountain, Play } from 'lucide-react';
import { useStore } from "@/lib/store/useStore";

export const LandingPage: React.FC = () => {
  const { setCurrentStep, createNewEntry } = useStore();
  
  const handleBeginJourney = () => {
    createNewEntry();
    setCurrentStep(0);
  };
  
  return (
    <div className="w-full max-w-2xl mx-auto text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="space-y-8"
      >
        {/* Hero Icon */}
        <div className="flex justify-center">
          <div className="p-6 bg-amber-400/20 rounded-full">
            <Mountain className="w-16 h-16 text-amber-400" />
          </div>
        </div>
        
        {/* Main Content */}
        <div className="space-y-6">
          <h1 className="text-5xl font-bold text-white leading-tight">
            The Mountain Pathway
          </h1>
          <p className="text-xl text-slate-300 font-light">
            Climb inward. Look upward.
          </p>
          <p className="text-lg text-slate-400 max-w-lg mx-auto leading-relaxed">
            A guided journey inward — and upward. Where quiet leads to clarity through 
            scripture, stillness, and structured reflection.
          </p>
        </div>
        
        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="pt-8"
        >
          <button
            onClick={handleBeginJourney}
            className="group flex items-center space-x-3 mx-auto px-8 py-4 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <Play className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
            <span>Begin Your Pathway</span>
          </button>
        </motion.div>
        
        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-sm text-slate-500 italic"
        >
          Follow the path. Find perspective.
        </motion.p>
      </motion.div>
    </div>
  );
};