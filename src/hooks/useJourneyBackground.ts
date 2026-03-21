import { useEffect, useState } from "react";
import { getBackgroundForStep } from "@/lib/pathway-data";

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

  const backgroundPositionClass = currentStep === 0 ? "bg-bottom" : "bg-center";

  return {
    currentBackground,
    backgroundPositionClass,
  };
}
