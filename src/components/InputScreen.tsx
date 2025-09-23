import React from "react";
import { motion } from "framer-motion";
import { useStore } from "@/lib/store/useStore";
import { PathwayStep, pathwayContent } from "@/lib/pathway-data";

interface InputScreenProps {
  step: PathwayStep;
}

export const InputScreen: React.FC<InputScreenProps> = ({ step }) => {
  const { currentEntry, updateResponse } = useStore();
  const currentValue =
    currentEntry.responses[step.key as keyof typeof currentEntry.responses] ||
    "";

  const handleInputChange = (value: string) => {
    updateResponse(step.key, value);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-6 w-full"
    >
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">{step.title}</h2>
        <p className="text-lg">{step.subtitle}</p>
      </div>

      <p className="leading-relaxed text-center">{step.prompt}</p>

      <div className="space-y-4">
        <textarea
          value={currentValue}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder={pathwayContent.general.textareaPlaceholder}
          className="w-full h-48 p-4 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent resize-none leading-relaxed shadow-sm"
          autoFocus
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
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-amber-800 text-sm text-center">
            {step.content.specialMessage}
          </p>
        </div>
      )}
    </motion.div>
  );
};
