import { useEffect, useState } from "react";
import { getBackgroundForStep, pathwayData } from "@/lib/pathway-data";

const DEFAULT_DESKTOP_ALIGNMENT = "[background-position:center_50%]";

export function useJourneyBackground(currentStep: number) {
  const [currentBackground, setCurrentBackground] = useState(
    "/homepage-background.v3.jpg"
  );

  useEffect(() => {
    const newBackground = getBackgroundForStep(currentStep);

    if (newBackground !== currentBackground) {
      const img = new Image();
      img.onload = () => {
        setCurrentBackground(newBackground);
      };
      img.src = newBackground;
    }
  }, [currentStep, currentBackground]);

  useEffect(() => {
    if (!currentBackground) {
      setCurrentBackground(getBackgroundForStep(currentStep));
    }
  }, [currentStep, currentBackground]);

  const stepData =
    currentStep >= 0 && currentStep < pathwayData.length
      ? pathwayData[currentStep]
      : null;
  const desktopAlignment =
    stepData?.desktopAlignment || DEFAULT_DESKTOP_ALIGNMENT;

  return {
    currentBackground,
    desktopAlignment,
  };
}
