import React from "react";
import { Mountain, Play } from "lucide-react";
import { useStore } from "@/lib/store/useStore";
import { pathwayContent } from "@/lib/pathway-data";
import { Button } from "@/components/ui/button";

export const LandingPage: React.FC = () => {
  const { setCurrentStep, createNewEntry } = useStore();

  const handleBeginJourney = () => {
    createNewEntry();
    setCurrentStep(0);
  };

  return (
    <div className="w-full max-w-2xl mx-auto text-center">
      <div className="space-y-8">
        {/* Hero Icon */}
        <div className="flex justify-center">
          <div className="p-6 bg-brand-gold/20 rounded-full">
            <Mountain className="w-16 h-16 text-brand-gold" />
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          <h1 className="text-5xl font-bold text-white leading-tight">
            {pathwayContent.landingPage.heroTitle}
          </h1>
          <p className="text-xl text-slate-300 font-light">
            {pathwayContent.landingPage.heroSubtitle}
          </p>
          <p className="text-lg text-slate-400 max-w-lg mx-auto leading-relaxed">
            {pathwayContent.landingPage.heroDescription}
          </p>
        </div>

        {/* Call to Action */}
        <div className="pt-8">
          <Button
            onClick={handleBeginJourney}
            variant="default"
            size="lg"
            className="group mx-auto px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <Play className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
            <span>{pathwayContent.landingPage.buttonText}</span>
          </Button>
        </div>

        {/* Subtitle */}
        <p className="text-sm text-slate-500 italic">
          {pathwayContent.landingPage.footerText}
        </p>
      </div>
    </div>
  );
};
