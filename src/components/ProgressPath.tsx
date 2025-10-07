import React from "react";
import {
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

export const ProgressPath: React.FC = () => {
  const { currentStep } = useStore();

  return (
    <nav className="relative pr-4">
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
  );
};
