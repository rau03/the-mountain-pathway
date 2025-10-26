import React from "react";
import { Mountain } from "lucide-react";
import { ProgressPath } from "./ProgressPath";
import { useStore } from "@/lib/store/useStore";

export const HeaderDesktop: React.FC = () => {
  const { resetJourney } = useStore();

  return (
    <header className="flex flex-col gap-6">
      {/* Brand Logotype - Clickable to return home */}
      <button
        onClick={resetJourney}
        className="flex items-center gap-3 bg-transparent border-none p-0 text-left cursor-pointer hover:opacity-80 transition-opacity"
      >
        <Mountain className="w-10 h-10 text-brand-gold" />
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold text-brand-slate leading-tight">
            The Mountain Pathway
          </h1>
          <p className="text-base text-brand-slate/70 leading-tight">
            Climb inward. Look upward.
          </p>
        </div>
      </button>

      {/* Progress Path */}
      <ProgressPath />
    </header>
  );
};
