import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useStore } from "@/lib/store/useStore";
import { pathwayData, pathwayContent } from "@/lib/pathway-data";
import { Button } from "@/components/ui/button";

export const Footer: React.FC = () => {
  const { currentStep, setCurrentStep, completeEntry } = useStore();

  if (currentStep === -1) return null;

  const canGoBack = currentStep > 0;
  const canGoNext = currentStep < 8;
  const isLastStep = currentStep === 8;

  const handleNext = () => {
    if (isLastStep) {
      completeEntry();
      setCurrentStep(9); // Go to summary
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <footer className="relative z-20 px-6 py-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center">
          <Button
            onClick={handleBack}
            disabled={!canGoBack}
            variant="secondary"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>{pathwayContent.navigation.backButtonText}</span>
          </Button>

          <div className="text-center">
            <p className="text-sm text-brand-slate/70">
              {currentStep < 9
                ? pathwayContent.navigation.stepCounterText
                    .replace("{current}", (currentStep + 1).toString())
                    .replace("{total}", "9")
                : pathwayContent.navigation.journeyCompleteText}
            </p>
          </div>

          <Button
            onClick={handleNext}
            variant="default"
            className="px-6 font-medium"
          >
            <span>
              {isLastStep
                ? pathwayContent.navigation.completeButtonText
                : pathwayContent.navigation.continueButtonText}
            </span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </footer>
  );
};
