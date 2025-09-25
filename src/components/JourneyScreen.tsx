import React from "react";
import { useStore } from "@/lib/store/useStore";
import { pathwayData } from "@/lib/pathway-data";
import { TimerScreen } from "./TimerScreen";
import { ReflectionScreen } from "./ReflectionScreen";
import { InputScreen } from "./InputScreen";

export const JourneyScreen: React.FC = () => {
  const { currentStep } = useStore();
  const step = pathwayData[currentStep];

  if (!step) return null;

  // Special screens
  if (step.isTimer) {
    return <TimerScreen step={step} />;
  }

  if (step.key === "reflect") {
    return <ReflectionScreen step={step} />;
  }

  // Regular input screens
  return <InputScreen step={step} />;
};
