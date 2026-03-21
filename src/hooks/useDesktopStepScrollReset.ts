import { RefObject, useEffect } from "react";

export function useDesktopStepScrollReset(
  currentStep: number,
  desktopScrollRef: RefObject<HTMLDivElement | null>
) {
  useEffect(() => {
    if (desktopScrollRef.current) {
      desktopScrollRef.current.scrollTop = 0;

      requestAnimationFrame(() => {
        if (desktopScrollRef.current) {
          desktopScrollRef.current.scrollTop = 0;
          desktopScrollRef.current.scrollTo({
            top: 0,
            left: 0,
            behavior: "instant" as ScrollBehavior,
          });
        }
      });

      setTimeout(() => {
        if (desktopScrollRef.current) {
          desktopScrollRef.current.scrollTop = 0;
        }
      }, 50);
    }
  }, [currentStep, desktopScrollRef]);
}
