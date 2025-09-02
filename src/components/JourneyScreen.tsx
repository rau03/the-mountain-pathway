import React from 'react';
import { motion } from 'framer-motion';
import { useStore } from "@/lib/store/useStore";
import { steps } from "@/lib/data/steps";
import { TimerScreen } from './TimerScreen';
import { ReflectionScreen } from './ReflectionScreen';
import { InputScreen } from './InputScreen';

export const JourneyScreen: React.FC = () => {
  const { currentStep } = useStore();
  const step = steps[currentStep];
  
  if (!step) return null;
  
  // Special screens
  if (step.isTimer) {
    return <TimerScreen step={step} />;
  }
  
  if (step.key === 'reflect') {
    return <ReflectionScreen step={step} />;
  }
  
  // Regular input screens
  return <InputScreen step={step} />;
};