import React from "react";
import { motion } from "framer-motion";
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
import { PathwayStep } from "@/lib/pathway-data";

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

interface ReflectionScreenProps {
  step: PathwayStep;
}

export const ReflectionScreen: React.FC<ReflectionScreenProps> = ({ step }) => {
  // Get the icon component for this step
  const IconComponent = iconMap[step.icon];
  const isScriptureStep = step.stepIndex === 1;

  const titleClass = isScriptureStep
    ? "text-3xl font-bold mb-2 text-white [text-shadow:0_2px_8px_rgba(0,0,0,0.65)]"
    : "text-3xl font-bold mb-2 text-slate-900";
  const subtitleClass = isScriptureStep
    ? "text-lg text-white [text-shadow:0_2px_7px_rgba(0,0,0,0.6)]"
    : "text-lg text-slate-800";
  const promptClass = isScriptureStep
    ? "leading-relaxed text-center text-white [text-shadow:0_2px_7px_rgba(0,0,0,0.6)]"
    : "leading-relaxed text-center text-slate-800";
  const scriptureCardClass = isScriptureStep
    ? "w-full h-[42vh] bg-white/75 rounded-lg p-6 overflow-y-auto border border-white/40 shadow-lg backdrop-blur-[2px] scrollbar-thin scrollbar-thumb-brand-slate/30"
    : "w-full h-[40vh] bg-white/50 rounded-lg p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-brand-slate/30";
  const instructionsClass = isScriptureStep
    ? "text-sm text-white/95 italic [text-shadow:0_1px_4px_rgba(0,0,0,0.5)]"
    : "text-sm text-brand-slate/70 italic";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-6 w-full"
    >
      <div
        className={`text-center ${isScriptureStep ? "bg-black/12 rounded-2xl px-4 py-5" : ""}`}
      >
        {/* Step Icon */}
        {IconComponent && (
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-amber-100 rounded-full">
              <IconComponent className="w-8 h-8 text-brand-gold" />
            </div>
          </div>
        )}

        <h2 className={titleClass}>
          {step.title}
        </h2>
        <p className={subtitleClass}>{step.subtitle}</p>
      </div>

      <p className={promptClass}>
        {step.prompt}
      </p>

      {/* Scripture Text - Integrated Scrolling Card */}
      {step.content?.scripture && (
        <div className="pr-2">
          <div className={scriptureCardClass}>
            <h3 className="text-xl font-semibold text-slate-900 mb-4">
              Psalm 139
            </h3>
            <div className="text-slate-900 leading-relaxed">
              {step.content.scripture.split("\n\n").map((paragraph, i, arr) => {
                const isAttribution = i === arr.length - 1 && paragraph.startsWith("—");
                return (
                  <p
                    key={i}
                    className={
                      isAttribution
                        ? "mt-6 text-sm italic text-slate-700 text-right"
                        : "mb-4"
                    }
                  >
                    {paragraph}
                  </p>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {step.content?.instructions && (
        <div className="pt-4 text-center">
          <p className={instructionsClass}>
            {step.content.instructions}
          </p>
        </div>
      )}
    </motion.div>
  );
};
