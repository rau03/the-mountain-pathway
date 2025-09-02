import React from 'react';
import { Mountain } from 'lucide-react';
import { ProgressPath } from './ProgressPath';
import { useStore } from "@/lib/store/useStore";

export const Header: React.FC = () => {
  const { currentStep } = useStore();
  
  return (
    <header className="relative z-20 px-6 py-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Mountain className="w-8 h-8 text-amber-400" />
            <div>
              <h1 className="text-2xl font-bold text-white">The Mountain Pathway</h1>
              <p className="text-sm text-slate-300">Climb inward. Look upward.</p>
            </div>
          </div>
        </div>
        
        {currentStep >= 0 && currentStep < 9 && (
          <ProgressPath />
        )}
      </div>
    </header>
  );
};