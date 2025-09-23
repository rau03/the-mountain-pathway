import React from "react";
import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import { PathwayStep } from "@/lib/pathway-data";

interface ReflectionScreenProps {
  step: PathwayStep;
}

export const ReflectionScreen: React.FC<ReflectionScreenProps> = ({ step }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-6 w-full"
    >
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-amber-100 rounded-full">
            <BookOpen className="w-8 h-8 text-brand-gold" />
          </div>
        </div>

        <h2 className="text-3xl font-bold mb-2">{step.title}</h2>
        <p className="text-lg">{step.subtitle}</p>
      </div>

      <p className="leading-relaxed text-center">{step.prompt}</p>

      {/* Scripture Text */}
      {step.content?.scripture && (
        <div className="bg-slate-100 rounded-xl p-6 max-h-96 overflow-y-auto">
          <h3 className="text-xl font-semibold text-brand-gold mb-4">
            Psalm 139
          </h3>
          <div className="text-slate-700 leading-relaxed whitespace-pre-line text-left">
            {step.content.scripture}
          </div>
        </div>
      )}

      {step.content?.instructions && (
        <div className="pt-4">
          <p className="text-sm text-slate-600 italic">
            {step.content.instructions}
          </p>
        </div>
      )}
    </motion.div>
  );
};
