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
import { useStore } from "@/lib/store/useStore";
import { BIBLE_TRANSLATIONS } from "@/lib/psalm139";
import { TranslationSelector } from "./TranslationSelector";

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
  const bibleTranslation = useStore((state) => state.bibleTranslation);
  const scriptureText = BIBLE_TRANSLATIONS[bibleTranslation];

  const titleClass = isScriptureStep
    ? "text-3xl font-bold mb-2 text-white [text-shadow:0_2px_8px_rgba(0,0,0,0.65)]"
    : "text-3xl font-bold mb-2 text-slate-900";
  const subtitleClass = isScriptureStep
    ? "text-lg text-white [text-shadow:0_2px_7px_rgba(0,0,0,0.6)]"
    : "text-lg text-slate-800";
  const promptClass = isScriptureStep
    ? "leading-relaxed text-center text-white [text-shadow:0_2px_7px_rgba(0,0,0,0.6)]"
    : "leading-relaxed text-center text-slate-800";
  const textCardClass = isScriptureStep
    ? "relative text-center rounded-2xl overflow-hidden"
    : "text-center";
  const textCardInnerClass = isScriptureStep
    ? "relative z-10 space-y-4 px-4 py-5"
    : "";
  const iconWrapClass = isScriptureStep
    ? "p-4 bg-black/25 backdrop-blur-md rounded-full border border-white/10 overflow-hidden"
    : "p-4 bg-amber-100 rounded-full";
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
      <div className={textCardClass}>
        {isScriptureStep && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/20" />
        )}
        <div className={textCardInnerClass}>
          {/* Step Icon */}
          {IconComponent && (
            <div className="flex justify-center mb-4">
              <div className={iconWrapClass}>
                <IconComponent className="w-8 h-8 text-brand-gold" />
              </div>
            </div>
          )}

          <h2 className={titleClass}>
            {step.title}
          </h2>
          <p className={subtitleClass}>{step.subtitle}</p>
          <p className={promptClass}>
            {step.prompt}
          </p>
        </div>
      </div>

      {/* Translation Selector + Scripture Text - Integrated Scrolling Card */}
      {isScriptureStep && (
        <div className="flex flex-col gap-4">
          <TranslationSelector />
          <div className="pr-2">
            <div className={scriptureCardClass}>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">
                Psalm 139
              </h3>
              <div className="text-slate-900 leading-relaxed">
                {scriptureText.split("\n").map((line, i) => {
                  const trimmedLine = line.trim();
                  const isAttribution =
                    trimmedLine.startsWith("—") || trimmedLine.startsWith("--");

                  if (!trimmedLine) {
                    return <div key={i} className="h-3" aria-hidden="true" />;
                  }

                  return (
                    <p
                      key={i}
                      className={
                        isAttribution
                          ? "mt-6 text-sm italic text-slate-700 text-right whitespace-pre-line"
                          : "psalm-verse whitespace-pre-line"
                      }
                    >
                      {line}
                    </p>
                  );
                })}
              </div>
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
