import React from "react";
import { Mountain } from "lucide-react";
import { ProgressPath } from "./ProgressPath";
import { useStore } from "@/lib/store/useStore";
import { pathwayContent } from "@/lib/pathway-data";

export const Header: React.FC = () => {
  const { currentStep } = useStore();

  return (
    <header className="relative z-20 px-6 py-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Mountain className="w-8 h-8 text-amber-400" />
            <div>
              <h1 className="text-2xl font-bold text-brand-slate">
                {pathwayContent.appTitle}
              </h1>
              <p className="text-sm text-brand-slate/80">
                {pathwayContent.appSubtitle}
              </p>
            </div>
          </div>
        </div>

        {currentStep >= 0 && currentStep < 9 && <ProgressPath />}
      </div>
    </header>
  );
};
