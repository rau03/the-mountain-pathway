import React from "react";
import Image from "next/image";
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
        <Image
          src="/gold_line_mountain_pathway.png"
          alt="Mountain Pathway Logo"
          width={88}
          height={88}
          className="w-[88px] h-[88px] object-contain drop-shadow-[0_0_6px_rgba(251,191,36,1)]"
          style={{
            filter: "brightness(0) saturate(100%) invert(70%) sepia(60%) saturate(2000%) hue-rotate(360deg) brightness(95%) contrast(110%)"
          }}
        />
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
