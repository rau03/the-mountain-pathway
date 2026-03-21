import { useEffect } from "react";
import { useStore } from "@/lib/store/useStore";

export function useUnsavedJourneyUnloadGuard() {
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      const { isDirty, currentStep, isSaved } = useStore.getState();

      if (isDirty && !isSaved && currentStep > -1 && currentStep < 9) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);
}
