import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useStore } from "@/lib/store/useStore";
import { steps } from "@/lib/data/steps";

export const Footer: React.FC = () => {
  const { currentStep, setCurrentStep, completeEntry } = useStore();
  
  if (currentStep === -1) return null;
  
  const canGoBack = currentStep > 0;
  const canGoNext = currentStep < 8;
  const isLastStep = currentStep === 8;
  
  const handleNext = () => {
    if (isLastStep) {
      completeEntry();
      setCurrentStep(9); // Go to summary
    } else {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  return (
    <footer className="relative z-20 px-6 py-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center">
          <button
            onClick={handleBack}
            disabled={!canGoBack}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
              canGoBack
                ? 'bg-slate-700 hover:bg-slate-600 text-white'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          
          <div className="text-center">
            <p className="text-sm text-slate-400">
              {currentStep < 9 ? `Step ${currentStep + 1} of 9` : 'Journey Complete'}
            </p>
          </div>
          
          <button
            onClick={handleNext}
            className="flex items-center space-x-2 px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-all duration-200 font-medium"
          >
            <span>{isLastStep ? 'Complete Journey' : 'Continue'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
};