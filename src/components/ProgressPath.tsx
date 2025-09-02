import React from 'react';
import { useStore } from "@/lib/store/useStore";
import { steps } from "@/lib/data/steps";

export const ProgressPath: React.FC = () => {
  const { currentStep } = useStore();
  
  return (
    <div className="w-full">
      <div className="flex items-center justify-between relative">
        {/* Progress Line */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-600 -translate-y-1/2" />
        <div 
          className="absolute top-1/2 left-0 h-0.5 bg-amber-400 -translate-y-1/2 transition-all duration-500"
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        />
        
        {/* Progress Dots */}
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`relative z-10 w-4 h-4 rounded-full border-2 transition-all duration-300 ${
              index <= currentStep
                ? 'bg-amber-400 border-amber-400'
                : 'bg-slate-700 border-slate-600'
            }`}
          >
            {index === currentStep && (
              <div className="absolute inset-0 rounded-full bg-amber-400 animate-pulse" />
            )}
          </div>
        ))}
      </div>
      
      {/* Step Labels */}
      <div className="flex justify-between mt-2">
        {steps.map((step, index) => (
          <div key={step.id} className="text-center">
            <p className={`text-xs transition-colors duration-300 ${
              index === currentStep ? 'text-amber-400 font-medium' : 'text-slate-400'
            }`}>
              {step.title}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};