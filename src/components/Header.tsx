import React from "react";
import {
  Mountain,
  Heart,
  BookOpen,
  PenLine,
  Lightbulb,
  Star,
  DoorOpen,
  Compass,
  HandHeart,
  LucideIcon,
} from "lucide-react";
import { useStore } from "@/lib/store/useStore";
import { pathwayData } from "@/lib/pathway-data";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Icon mapping for dynamic icon rendering
const iconMap: Record<string, LucideIcon> = {
  Heart,
  BookOpen,
  PenLine,
  Lightbulb,
  Star,
  DoorOpen,
  Compass,
  HandHeart,
};

export const Header: React.FC = () => {
  const { currentStep } = useStore();

  return (
    <header className="flex flex-col gap-4">
      {/* Top Section: Logo and Title */}
      <div className="flex items-center gap-3">
        <Mountain className="w-10 h-10 text-brand-gold" />
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold text-brand-slate leading-tight">
            The Mountain Pathway
          </h1>
          <p className="text-base text-brand-slate/70 leading-tight">
            Climb inward. Look upward.
          </p>
        </div>
      </div>

      {/* Bottom Section: Icon-Based Progress Path */}
      <nav className="relative">
        <TooltipProvider delayDuration={200}>
          <div className="flex items-center justify-between">
            {/* Connecting Line */}
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-300 -translate-y-1/2 -z-10">
              <div
                className="h-full bg-brand-gold transition-all duration-500"
                style={{
                  width: `${(currentStep / (pathwayData.length - 1)) * 100}%`,
                }}
              />
            </div>

            {/* Icon Steps */}
            {pathwayData.map((step) => {
              const isActive = currentStep === step.stepIndex;
              const isCompleted = currentStep > step.stepIndex;
              const IconComponent = iconMap[step.icon];

              return (
                <Tooltip key={step.stepIndex}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`relative rounded-full transition-all duration-300 ${
                        isActive
                          ? "bg-brand-gold text-white hover:bg-brand-gold/90 shadow-md"
                          : isCompleted
                          ? "bg-brand-gold/80 text-white hover:bg-brand-gold/70"
                          : "bg-slate-200 text-brand-slate/60 hover:bg-slate-300"
                      }`}
                    >
                      {IconComponent && <IconComponent className="w-4 h-4" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="font-medium">{step.title}</p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </TooltipProvider>
      </nav>
    </header>
  );
};
