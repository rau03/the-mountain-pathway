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
    <div className="w-full max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-slate-700"
      >
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-2">{step.title}</h2>
            <p className="text-slate-300 text-lg">{step.subtitle}</p>
          </div>

          <p className="text-slate-400 leading-relaxed text-center">
            {step.prompt}
          </p>

          <div className="space-y-4">
            <textarea
              value={currentValue}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder={pathwayContent.general.textareaPlaceholder}
              className="w-full h-48 p-4 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent resize-none leading-relaxed"
              autoFocus
            />

            <div className="text-right">
              <p className="text-xs text-slate-500">
                {pathwayContent.general.characterCountText.replace(
                  "{count}",
                  currentValue.length.toString()
                )}
              </p>
            </div>
          </div>

          {step.isSummary && step.content?.specialMessage && (
            <div className="bg-brand-gold/10 border border-brand-gold/30 rounded-lg p-4">
              <p className="text-brand-gold text-sm text-center">
                {step.content.specialMessage}
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
