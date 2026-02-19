import React from "react";
import { Play, HelpCircle, Coffee, Mail } from "lucide-react";
import { pathwayContent } from "@/lib/pathway-data";
import { Button } from "@/components/ui/button";
import { openEmail, openExternalUrl } from "@/lib/capacitorUtils";

type LandingPageProps = {
  onBeginClick: () => void;
  onLearnMoreClick?: () => void;
};

export const LandingPage: React.FC<LandingPageProps> = ({
  onBeginClick,
  onLearnMoreClick,
}) => {
  return (
    <div className="h-[100svh] flex flex-col items-center justify-between md:justify-center px-6 pt-12 pb-16 md:gap-8 overflow-hidden">
      {/* Top Section: Hero Content (Mobile: Top-Weighted, Desktop: Centered) */}
      <div className="flex flex-col items-center gap-4 md:gap-8">
        {/* Hero Icon - gold_lines with subtle translucent blurred background */}
        <div className="p-4 bg-black/25 backdrop-blur-md rounded-full border border-white/10 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/gold_lines_no%20background_mp.png"
            alt="Mountain Pathway"
            width={64}
            height={64}
            className="w-16 h-16 object-contain scale-[1.75]"
            style={{ filter: "brightness(0.88) saturate(1.6) hue-rotate(-3deg) contrast(1.12)" }}
          />
        </div>

        {/* Main Content with Text Protection */}
        <div className="relative">
          {/* Text Protection Gradient Overlay - Enhanced for better readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/20 rounded-lg" />

          {/* Text Content */}
          <div className="relative z-10 max-w-2xl space-y-3 md:space-y-6 text-center p-4 md:p-8">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight text-white [text-shadow:0_2px_8px_rgba(0,0,0,0.6),0_1px_3px_rgba(0,0,0,0.4)]">
              {pathwayContent.landingPage.heroTitle}
            </h1>
            <p className="text-lg md:text-xl font-light text-white [text-shadow:0_2px_6px_rgba(0,0,0,0.5),0_1px_2px_rgba(0,0,0,0.3)]">
              {pathwayContent.landingPage.heroSubtitle}
            </p>
            <p className="text-base md:text-lg leading-relaxed text-white/95 [text-shadow:0_2px_6px_rgba(0,0,0,0.5),0_1px_2px_rgba(0,0,0,0.3)]">
              {pathwayContent.landingPage.heroDescription}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Section: CTA & Footer (Mobile: Anchored at Bottom, Desktop: Centered) */}
      <div className="flex flex-col items-center gap-3 md:gap-6 md:pt-8">
        {/* Call to Action */}
        <Button
          onClick={onBeginClick}
          size="lg"
          className="group mx-auto flex items-center gap-2 px-8 py-4 rounded-md font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl bg-brand-gold text-slate-900 hover:bg-brand-gold/90"
        >
          <Play className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
          <span>{pathwayContent.landingPage.buttonText}</span>
        </Button>

        {/* Subtitle */}
        <p className="text-sm text-white italic font-medium [text-shadow:0_2px_6px_rgba(0,0,0,0.5),0_1px_2px_rgba(0,0,0,0.3)]">
          {pathwayContent.landingPage.footerText}
        </p>

        {/* Footer Links - Tighter spacing */}
        <div className="flex flex-col items-center gap-2">
          {/* Learn More Link */}
          {onLearnMoreClick && (
            <button
              onClick={onLearnMoreClick}
              className="flex items-center gap-1.5 text-sm text-white/80 hover:text-white transition-colors [text-shadow:0_1px_3px_rgba(0,0,0,0.4)]"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Who is this for?</span>
            </button>
          )}

          {/* Buy Me a Coffee Link */}
          <a
            href="https://buymeacoffee.com/themountainpathway"
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              e.preventDefault();
              void openExternalUrl("https://buymeacoffee.com/themountainpathway");
            }}
            className="flex items-center gap-2 text-base text-white/80 hover:text-white transition-colors [text-shadow:0_1px_3px_rgba(0,0,0,0.4)]"
          >
            <Coffee className="w-5 h-5" />
            <span>Buy me a Coffee</span>
          </a>

          {/* Contact Link */}
          <button
            onClick={() => openEmail("hello@themountainpathway.com")}
            className="flex items-center gap-1.5 text-sm text-white/80 hover:text-white transition-colors [text-shadow:0_1px_3px_rgba(0,0,0,0.4)]"
          >
            <Mail className="w-4 h-4" />
            <span>Contact</span>
          </button>
        </div>
      </div>
    </div>
  );
};
