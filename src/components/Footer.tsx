import React from "react";
import { ChevronLeft, ArrowRight } from "lucide-react";
import { useStore } from "@/lib/store/useStore";
import { pathwayContent } from "@/lib/pathway-data";
import { Button } from "@/components/ui/button";

export const Footer: React.FC = () => {
  const { currentStep, setCurrentStep, completeEntry } = useStore();

  if (currentStep === -1) return null;

  const canGoBack = currentStep > 0;
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

  const stepText =
    currentStep < 9
      ? pathwayContent.navigation.stepCounterText
          .replace("{current}", (currentStep + 1).toString())
          .replace("{total}", "9")
      : pathwayContent.navigation.journeyCompleteText;

  return (
    <footer className="relative z-20 px-4 py-2 md:p-8">
      <div className="max-w-4xl mx-auto w-full">
        {/* Mobile: Icon-only buttons with centered text */}
        <div className="md:hidden bg-black/10 backdrop-blur-sm rounded-lg p-2">
          <div className="flex items-center justify-between">
            {/* Back Button */}
            <Button
              onClick={handleBack}
              disabled={!canGoBack}
              variant="secondary"
              size="sm"
              className="px-1 py-1 text-xs h-7"
            >
              <ChevronLeft className="w-3 h-3" />
            </Button>

            {/* Step Text - Centered */}
            <div className="text-center">
              <p className="text-xs text-white font-medium drop-shadow-sm">
                {stepText}
              </p>
            </div>

            {/* Continue Button - Icon Only */}
            <Button
              onClick={handleNext}
              variant="default"
              size="sm"
              className="px-1 py-1 text-xs h-7"
            >
              <ArrowRight className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* Desktop: Unchanged layout with generous padding */}
        <div className="hidden md:flex justify-between items-center bg-black/10 backdrop-blur-sm rounded-lg p-8">
          <Button
            onClick={handleBack}
            disabled={!canGoBack}
            variant="secondary"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>{pathwayContent.navigation.backButtonText}</span>
          </Button>

          <div className="text-center">
            <p className="text-sm text-white font-medium drop-shadow-sm">
              {stepText}
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
