import React from "react";
import { Mountain, Play } from "lucide-react";
import { useStore } from "@/lib/store/useStore";
import { pathwayContent } from "@/lib/pathway-data";
import { Button } from "@/components/ui/button";

export const LandingPage: React.FC = () => {
  const { startJourney } = useStore();

  const handleBeginJourney = () => {
    startJourney();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 w-full text-center px-8">
      {/* Hero Icon */}
      <div className="flex justify-center">
        <div className="p-6 bg-brand-gold/20 backdrop-blur-sm rounded-full border border-brand-gold/30">
          <Mountain className="w-16 h-16 text-brand-gold drop-shadow-lg" />
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-6 max-w-2xl">
        <h1 className="text-5xl font-bold leading-tight text-white drop-shadow-md">
          {pathwayContent.landingPage.heroTitle}
        </h1>
        <p className="text-xl font-light text-white drop-shadow-md">
          {pathwayContent.landingPage.heroSubtitle}
        </p>
        <p className="text-lg leading-relaxed text-white/90 drop-shadow-md">
          {pathwayContent.landingPage.heroDescription}
        </p>
      </div>

      {/* Call to Action */}
      <div className="pt-8">
        <Button
          onClick={handleBeginJourney}
          size="lg"
          className="group mx-auto px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl bg-brand-gold text-slate-900 hover:bg-brand-gold/90"
        >
          <Play className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
          <span>{pathwayContent.landingPage.buttonText}</span>
        </Button>
      </div>

      {/* Subtitle */}
      <p className="text-sm text-white/80 italic drop-shadow-md">
        {pathwayContent.landingPage.footerText}
      </p>
    </div>
  );
};
