import React from "react";
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
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-black/10 backdrop-blur-sm border border-brand-slate/20 overflow-hidden">
          <img
            src="/gold_lines_no%20background_mp.png"
            alt="Mountain Pathway"
            width={32}
            height={32}
            className="w-8 h-8 object-contain scale-[1.75]"
            style={{ filter: "brightness(0.88) saturate(1.6) hue-rotate(-3deg) contrast(1.12)" }}
          />
        </span>
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
