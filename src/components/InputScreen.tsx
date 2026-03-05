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
    ? "text-3xl font-bold mb-2 text-white [text-shadow:0_2px_8px_rgba(0,0,0,0.65)]"
    : "text-3xl font-bold mb-2 text-slate-900";
  const subtitleClass = isImageFirstInputStep
    ? "text-lg text-white [text-shadow:0_2px_7px_rgba(0,0,0,0.6)]"
    : "text-lg text-slate-800";
  const promptClass = isImageFirstInputStep
    ? "leading-relaxed text-center text-white [text-shadow:0_2px_7px_rgba(0,0,0,0.6)] pr-2"
    : "leading-relaxed text-center text-slate-800 pr-2";
  const textCardClass = isImageFirstInputStep
    ? "relative text-center rounded-2xl overflow-hidden"
    : "text-center";
  const textCardInnerClass = isImageFirstInputStep
    ? "relative z-10 space-y-4 px-4 py-5"
    : "";
  const iconWrapClass = isImageFirstInputStep
    ? "p-4 bg-black/25 backdrop-blur-md rounded-full border border-white/10 overflow-hidden"
    : "p-4 bg-amber-100 rounded-full";
  const inputCardClass = isImageFirstInputStep
    ? "w-full h-48 bg-white/65 rounded-lg p-6 shadow-lg border border-white/40 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent resize-none leading-relaxed"
    : "w-full h-48 bg-white/50 rounded-lg p-6 shadow-md border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent resize-none leading-relaxed";
  const countTextClass = isImageFirstInputStep
    ? "text-xs text-white/95 [text-shadow:0_1px_4px_rgba(0,0,0,0.5)]"
    : "text-xs text-slate-600";

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

      {/* Step 9 Prayer Guidance Accordion - Moved above textarea */}
      {step.stepIndex === 8 && (
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="prayer-guide" className="border-none">
            <AccordionTrigger className="hover:no-underline [&>svg]:hidden">
              <span className="px-4 py-2 bg-white/50 hover:bg-white/70 border border-slate-300 rounded-lg text-sm text-brand-slate font-medium transition-colors shadow-sm">
                Need a guide for prayer?
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 pt-2">
                <p className="text-sm text-brand-slate/80 mb-4">
                  Here&apos;s a simple framework to help structure your prayer:
                </p>
                {prayerGuidance.map((guide, index) => (
                  <div
                    key={index}
                    className="border-l-2 border-brand-gold/30 pl-4"
                  >
                    <h4 className="font-semibold text-brand-slate text-sm mb-1">
                      {guide.title}
                    </h4>
                    <p className="text-sm text-brand-slate/80 leading-relaxed">
                      {guide.content}
                    </p>
                  </div>
                ))}
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
          <div className="bg-white/50 border border-slate-300 rounded-lg p-4 shadow-sm">
            <p className="text-brand-slate text-sm text-center">
              {step.content.specialMessage}
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
};
