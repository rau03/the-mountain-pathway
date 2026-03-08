import React, { useRef } from "react";
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
import { useStore } from "@/lib/store/useStore";
import { PathwayStep, pathwayContent } from "@/lib/pathway-data";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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

interface InputScreenProps {
  step: PathwayStep;
}

export const InputScreen: React.FC<InputScreenProps> = ({ step }) => {
  const { currentEntry, updateResponse } = useStore();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const currentValue =
    currentEntry.responses[step.key as keyof typeof currentEntry.responses] ||
    "";

  const handleInputChange = (value: string) => {
    updateResponse(step.key, value);
  };

  const handleTextareaFocus = () => {
    // Wait for keyboard animation to complete
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }, 300);
  };

  const handleBlur = () => {
    // Avoid forcing scroll-to-top on iOS; it can fight user scroll and feel "locked"
  };

  // Get the icon component for this step
  const IconComponent = iconMap[step.icon];
  const isImageFirstInputStep =
    step.stepIndex === 2 ||
    step.stepIndex === 3 ||
    step.stepIndex === 4 ||
    step.stepIndex === 5 ||
    step.stepIndex === 6 ||
    step.stepIndex === 7 ||
    step.stepIndex === 8;

  const titleClass = isImageFirstInputStep
    ? "text-3xl font-bold mb-2 text-white [text-shadow:0_2px_8px_rgba(0,0,0,0.65)] md:text-slate-900 md:[text-shadow:none]"
    : "text-3xl font-bold mb-2 text-slate-900";
  const subtitleClass = isImageFirstInputStep
    ? "text-lg text-white [text-shadow:0_2px_7px_rgba(0,0,0,0.6)] md:text-slate-800 md:[text-shadow:none]"
    : "text-lg text-slate-800";
  const promptClass = isImageFirstInputStep
    ? "leading-relaxed text-center text-white [text-shadow:0_2px_7px_rgba(0,0,0,0.6)] pr-2 md:text-slate-800 md:[text-shadow:none]"
    : "leading-relaxed text-center text-slate-800 pr-2";
  const textCardClass = isImageFirstInputStep
    ? "relative text-center rounded-2xl overflow-hidden"
    : "text-center";
  const textCardInnerClass = isImageFirstInputStep
    ? "relative z-10 space-y-4 px-4 py-5"
    : "";
  const iconWrapClass = isImageFirstInputStep
    ? "p-4 bg-black/25 backdrop-blur-md rounded-full border border-white/10 overflow-hidden md:bg-amber-100 md:border-transparent md:backdrop-blur-none"
    : "p-4 bg-amber-100 rounded-full";
  const inputCardClass = isImageFirstInputStep
    ? "w-full h-48 bg-white/65 rounded-lg p-6 shadow-lg border border-white/40 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent resize-none leading-relaxed"
    : "w-full h-48 bg-white/50 rounded-lg p-6 shadow-md border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent resize-none leading-relaxed";
  const countTextClass = isImageFirstInputStep
    ? "text-xs text-white/95 [text-shadow:0_1px_4px_rgba(0,0,0,0.5)] md:text-slate-600 md:[text-shadow:none]"
    : "text-xs text-slate-600";
  const prayerGuideCardClass = isImageFirstInputStep
    ? "relative rounded-2xl overflow-hidden"
    : "space-y-4 bg-white/50 rounded-lg p-6 shadow-md border border-slate-300 text-slate-900";
  const prayerGuideInnerClass = isImageFirstInputStep
    ? "relative z-10 space-y-4 px-4 py-5"
    : "";
  const prayerGuideIntroClass = isImageFirstInputStep
    ? "text-sm text-white [text-shadow:0_2px_7px_rgba(0,0,0,0.6)] mb-4 md:text-slate-800 md:[text-shadow:none]"
    : "text-sm text-slate-800 mb-4";
  const prayerGuideTitleClass = isImageFirstInputStep
    ? "font-semibold text-white text-sm mb-1 [text-shadow:0_2px_7px_rgba(0,0,0,0.6)] md:text-slate-900 md:[text-shadow:none]"
    : "font-semibold text-slate-900 text-sm mb-1";
  const prayerGuideContentClass = isImageFirstInputStep
    ? "text-sm text-white leading-relaxed [text-shadow:0_2px_7px_rgba(0,0,0,0.6)] md:text-slate-800 md:[text-shadow:none]"
    : "text-sm text-slate-800 leading-relaxed";
  const prayerGuideButtonClass = isImageFirstInputStep
    ? "px-4 py-2 bg-black/25 hover:bg-black/35 border border-white/30 rounded-lg text-sm text-white font-semibold transition-colors shadow-sm [text-shadow:0_2px_7px_rgba(0,0,0,0.6)] md:bg-slate-100 md:hover:bg-slate-200 md:border-slate-300 md:text-slate-900 md:[text-shadow:none]"
    : "px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg text-sm text-slate-900 font-semibold transition-colors shadow-sm";
  const summaryCardClass = isImageFirstInputStep
    ? "relative rounded-2xl overflow-hidden"
    : "bg-white/50 border border-slate-300 rounded-lg p-4 shadow-sm";
  const summaryInnerClass = isImageFirstInputStep ? "relative z-10 px-4 py-5" : "";
  const summaryTextClass = isImageFirstInputStep
    ? "text-white text-sm text-center [text-shadow:0_2px_7px_rgba(0,0,0,0.6)] md:text-brand-slate md:[text-shadow:none]"
    : "text-brand-slate text-sm text-center";

  // Prayer guidance points for Step 9
  const prayerGuidance = [
    {
      title: "Adoration",
      content:
        "Begin by acknowledging who God is. Praise Him for His character, His love, and His faithfulness in your life.",
    },
    {
      title: "Confession",
      content:
        "Honestly bring before God any areas where you've fallen short. Ask for His forgiveness and cleansing.",
    },
    {
      title: "Thanksgiving",
      content:
        "Thank God for His blessings, His provision, and the ways He has worked in your situation.",
    },
    {
      title: "Supplication",
      content:
        "Present your requests, concerns, and needs to God. Ask for His guidance and intervention.",
    },
    {
      title: "Surrender",
      content:
        "Release control of your situation to God. Trust Him with the outcome and commit to following His lead.",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-6 w-full"
    >
      <div className={textCardClass}>
        {isImageFirstInputStep && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/20 md:bg-none md:bg-brand-stone/85" />
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

      {/* Step 9 Prayer Guidance Accordion - Moved above textarea */}
      {step.stepIndex === 8 && (
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="prayer-guide" className="border-none">
            <AccordionTrigger className="hover:no-underline [&>svg]:hidden">
              <span className={prayerGuideButtonClass}>
                Need a guide for prayer?
              </span>
            </AccordionTrigger>
            <AccordionContent className="pt-2">
              <div className={prayerGuideCardClass}>
                {isImageFirstInputStep && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/20 md:bg-none md:bg-brand-stone/85" />
                )}
                <div className={prayerGuideInnerClass}>
                  <p className={prayerGuideIntroClass}>
                    Here&apos;s a simple framework to help structure your prayer:
                  </p>
                  {prayerGuidance.map((guide, index) => (
                    <div
                      key={index}
                      className="border-l-2 border-brand-gold/50 pl-4"
                    >
                      <h4 className={prayerGuideTitleClass}>
                        {guide.title}
                      </h4>
                      <p className={prayerGuideContentClass}>
                        {guide.content}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}

      <div className="space-y-4 pr-2">
        <textarea
          ref={textareaRef}
          value={currentValue}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={handleTextareaFocus}
          onBlur={handleBlur}
          placeholder={pathwayContent.general.textareaPlaceholder}
          className={inputCardClass}
        />

        <div className="text-right">
          <p className={countTextClass}>
            {pathwayContent.general.characterCountText.replace(
              "{count}",
              currentValue.length.toString()
            )}
          </p>
        </div>
      </div>

      {step.isSummary && step.content?.specialMessage && (
        <div className="pr-2">
          <div className={summaryCardClass}>
            {isImageFirstInputStep && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/20 md:bg-none md:bg-brand-stone/85" />
            )}
            <div className={summaryInnerClass}>
              <p className={summaryTextClass}>
                {step.content.specialMessage}
              </p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};
