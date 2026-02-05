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

      <p className="leading-relaxed text-center text-brand-slate/80">
        {step.prompt}
      </p>

      {/* Scripture Text - Integrated Scrolling Card */}
      {step.content?.scripture && (
        <div className="pr-2">
          <div className="w-full h-[40vh] bg-white/50 rounded-lg p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-brand-slate/30">
            <h3 className="text-xl font-semibold text-brand-gold mb-4">
              Psalm 139
            </h3>
            <div className="text-slate-700 leading-relaxed whitespace-pre-line">
              {step.content.scripture}
            </div>
          </div>
        </div>
      )}

      {step.content?.instructions && (
        <div className="pt-4 text-center">
          <p className="text-sm text-brand-slate/70 italic">
            {step.content.instructions}
          </p>
        </div>
      )}
    </motion.div>
  );
};
