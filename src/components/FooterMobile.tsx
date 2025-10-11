import React from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useStore } from "@/lib/store/useStore";
import { pathwayData } from "@/lib/pathway-data";
import { Button } from "@/components/ui/button";

export const FooterMobile: React.FC = () => {
  const { currentStep, nextStep, prevStep } = useStore();
  const isFirstStep = currentStep === 0;

  return (
    <footer className="w-full flex items-center justify-between">
      {/* Back Button - Small Icon Only */}
      <Button
        onClick={prevStep}
        disabled={isFirstStep}
        variant="ghost"
        size="sm"
        className="h-9 w-9 p-0 disabled:opacity-30"
        aria-label="Previous step"
      >
        <ArrowLeft className="h-4 w-4" />
      </Button>

      {/* Step Counter - Centered Text */}
      <p className="text-xs text-brand-slate/70 font-medium">
        Step {currentStep + 1} of {pathwayData.length}
      </p>

      {/* Next Button - Small Icon Only */}
      <Button
        onClick={nextStep}
        size="sm"
        className="h-9 w-9 p-0"
        aria-label="Next step"
      >
        <ArrowRight className="h-4 w-4" />
      </Button>
    </footer>
  );
};
