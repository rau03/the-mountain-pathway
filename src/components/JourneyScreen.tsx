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
import { TimerScreen } from "./TimerScreen";
import { ReflectionScreen } from "./ReflectionScreen";
import { InputScreen } from "./InputScreen";

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

interface JourneyScreenProps {
  renderLocation?: "floating" | "sheet";
}

export const JourneyScreen: React.FC<JourneyScreenProps> = ({
  renderLocation = "sheet",
}) => {
  const { currentStep } = useStore();
  const step = pathwayData[currentStep];

  if (!step) return null;

  const IconComponent = iconMap[step.icon];

  // FLOATING MODE: Render only the icon, title, subtitle, and prompt
  if (renderLocation === "floating") {
    return (
      <div className="flex flex-col items-center gap-6 text-center px-6 py-8">
        {/* Step Icon */}
        {IconComponent && (
          <div className="p-4 bg-brand-gold/20 backdrop-blur-sm rounded-full border border-brand-gold/30">
            <IconComponent className="w-10 h-10 text-brand-gold drop-shadow-lg" />
          </div>
        )}

        {/* Title */}
        <h2 className="text-3xl font-bold text-white [text-shadow:0_2px_8px_rgba(0,0,0,0.6)]">
          {step.title}
        </h2>

        {/* Subtitle */}
        <p className="text-lg text-white/90 [text-shadow:0_2px_6px_rgba(0,0,0,0.5)]">
          {step.subtitle}
        </p>

        {/* Prompt */}
        <p className="text-base leading-relaxed text-white/95 max-w-xl [text-shadow:0_2px_6px_rgba(0,0,0,0.5)]">
          {step.prompt}
        </p>
      </div>
    );
  }

  // SHEET MODE: Render only the interactive elements
  if (renderLocation === "sheet") {
    // Special screens
    if (step.isTimer) {
      return <TimerScreen step={step} />;
    }

    if (step.key === "reflect") {
      return <ReflectionScreen step={step} />;
    }

    // Regular input screens
    return <InputScreen step={step} />;
  }

  // DEFAULT: Render everything together (for desktop)
  return (
    <>
      {/* Icon, Title, Subtitle, Prompt */}
      <div className="flex flex-col items-center gap-6 text-center mb-8">
        {IconComponent && (
          <div className="p-4 bg-brand-gold/20 backdrop-blur-sm rounded-full border border-brand-gold/30">
            <IconComponent className="w-10 h-10 text-brand-gold" />
          </div>
        )}

        <h2 className="text-3xl font-bold text-brand-slate">{step.title}</h2>

        <p className="text-lg text-brand-slate/80">{step.subtitle}</p>

        <p className="text-base leading-relaxed text-brand-slate/70 max-w-xl">
          {step.prompt}
        </p>
      </div>

      {/* Interactive Content */}
      {step.isTimer ? (
        <TimerScreen step={step} />
      ) : step.key === "reflect" ? (
        <ReflectionScreen step={step} />
      ) : (
        <InputScreen step={step} />
      )}
    </>
  );
};
