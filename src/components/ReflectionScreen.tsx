import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import { Step } from "@/types";
import { psalm139 } from "@/lib/data/steps";

interface ReflectionScreenProps {
  step: Step;
}

export const ReflectionScreen: React.FC<ReflectionScreenProps> = ({ step }) => {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-slate-700"
      >
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="p-4 bg-amber-400/20 rounded-full">
              <BookOpen className="w-8 h-8 text-amber-400" />
            </div>
          </div>
          
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">{step.title}</h2>
            <p className="text-slate-300 text-lg">{step.subtitle}</p>
          </div>
          
          <p className="text-slate-400 leading-relaxed">
            {step.prompt}
          </p>
          
          {/* Psalm Text */}
          <div className="bg-slate-900/50 rounded-xl p-6 max-h-96 overflow-y-auto">
            <h3 className="text-xl font-semibold text-amber-400 mb-4">Psalm 139</h3>
            <div className="text-slate-300 leading-relaxed whitespace-pre-line text-left">
              {psalm139}
            </div>
          </div>
          
          <div className="pt-4">
            <p className="text-sm text-slate-500 italic">
              Take your time. Let the words settle in your heart.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};