import React from "react";
import { Mountain, Play } from "lucide-react";
import { useStore } from "@/lib/store/useStore";
import { pathwayContent } from "@/lib/pathway-data";
import { Button } from "@/components/ui/button";

export const LandingPage: React.FC = () => {
  const { startJourney } = useStore();

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-between md:justify-center p-8 pt-16 pb-8 md:gap-8">
      {/* Top Section: Hero Content (Mobile: Top-Weighted, Desktop: Centered) */}
      <div className="flex flex-col items-center gap-6 md:gap-8">
        {/* Hero Icon */}
        <div className="p-6 bg-brand-gold/20 backdrop-blur-sm rounded-full border border-brand-gold/30">
          <Mountain className="w-16 h-16 text-brand-gold drop-shadow-lg" />
        </div>

        {/* Main Content with Text Protection */}
        <div className="relative">
          {/* Text Protection Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-lg" />

          {/* Text Content */}
          <div className="relative z-10 max-w-2xl space-y-4 md:space-y-6 text-center p-6 md:p-8">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight text-white/90 [text-shadow:0_2px_4px_rgba(0,0,0,0.4)]">
              {pathwayContent.landingPage.heroTitle}
            </h1>
            <p className="text-lg md:text-xl font-light text-white/90 [text-shadow:0_2px_4px_rgba(0,0,0,0.4)]">
              {pathwayContent.landingPage.heroSubtitle}
            </p>
            <p className="text-base md:text-lg leading-relaxed text-white/90 [text-shadow:0_2px_4px_rgba(0,0,0,0.4)]">
              {pathwayContent.landingPage.heroDescription}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Section: CTA & Footer (Mobile: Anchored at Bottom, Desktop: Centered) */}
      <div className="flex flex-col items-center gap-4 md:gap-6 md:pt-8">
        {/* Call to Action */}
        <Button
          onClick={startJourney}
          size="lg"
          className="group mx-auto flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl bg-brand-gold text-slate-900 hover:bg-brand-gold/90"
        >
          <Play className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
          <span>{pathwayContent.landingPage.buttonText}</span>
        </Button>

        {/* Subtitle */}
        <p className="text-sm text-white/90 italic font-medium [text-shadow:0_2px_4px_rgba(0,0,0,0.4)]">
          {pathwayContent.landingPage.footerText}
        </p>
      </div>
    </div>
  );
};
