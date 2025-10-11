import React from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useStore } from "@/lib/store/useStore";
import { pathwayData } from "@/lib/pathway-data";
import { Button } from "@/components/ui/button";

export const FooterDesktop: React.FC = () => {
  const { currentStep, nextStep, prevStep } = useStore();
  const isFirstStep = currentStep === 0;

  return (
    <footer className="w-full flex items-center justify-between">
      {/* Back Button */}
      <Button
        onClick={prevStep}
        disabled={isFirstStep}
        variant="ghost"
        size="lg"
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>

      {/* Step Counter */}
      <p className="text-sm text-brand-slate/70">
        Step {currentStep + 1} of {pathwayData.length}
      </p>

      {/* Continue/Next Button */}
      <Button onClick={nextStep} size="lg">
        <ArrowRight className="h-5 w-5" />
      </Button>
    </footer>
  );
};
