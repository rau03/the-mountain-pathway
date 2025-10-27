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

  // Get the icon component for this step
  const IconComponent = iconMap[step.icon];

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
      <div className="text-center">
        {/* Step Icon */}
        {IconComponent && (
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-amber-100 rounded-full">
              <IconComponent className="w-8 h-8 text-brand-gold" />
            </div>
          </div>
        )}

        <h2 className="text-3xl font-bold mb-2 text-brand-slate">
          {step.title}
        </h2>
        <p className="text-lg text-brand-slate/90">{step.subtitle}</p>
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

      <p className="leading-relaxed text-center text-brand-slate/80 pr-2">
        {step.prompt}
      </p>

      <div className="space-y-4 pr-2">
        <textarea
          ref={textareaRef}
          value={currentValue}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={handleTextareaFocus}
          placeholder={pathwayContent.general.textareaPlaceholder}
          className="w-full h-48 bg-white/50 rounded-lg p-6 shadow-md border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent resize-none leading-relaxed"
        />

        <div className="text-right">
          <p className="text-xs text-slate-600">
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
