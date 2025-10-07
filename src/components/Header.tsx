import React from "react";
import { Mountain } from "lucide-react";
import { useStore } from "@/lib/store/useStore";
import { pathwayData } from "@/lib/pathway-data";

export const Header: React.FC = () => {
  const { currentStep } = useStore();

  return (
    <header className="flex flex-col gap-4">
      {/* Top Section: Logo and Title */}
      <div className="flex items-center gap-2">
        <Mountain className="w-6 h-6 text-brand-slate" />
        <h1 className="text-lg font-bold text-brand-slate">
          The Mountain Pathway
        </h1>
      </div>

      {/* Bottom Section: Progress Path */}
      <nav className="flex items-center justify-between gap-4">
        {pathwayData.map((step) => {
          const isActive = currentStep === step.stepIndex;
          const isCompleted = currentStep > step.stepIndex;

          return (
            <div key={step.stepIndex} className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full transition-all ${
                  isActive || isCompleted ? "bg-brand-gold" : "bg-slate-300"
                }`}
              />
              <span
                className={`text-sm transition-all ${
                  isActive
                    ? "bg-brand-slate/50 text-brand-gold px-2.5 py-1 rounded-full"
                    : "text-brand-slate/70"
                }`}
              >
                {step.title}
              </span>
            </div>
          );
        })}
      </nav>
    </header>
  );
};
