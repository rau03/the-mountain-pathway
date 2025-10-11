import React from "react";
import { Mountain } from "lucide-react";
import { ProgressPath } from "./ProgressPath";

export const HeaderDesktop: React.FC = () => {
  return (
    <header className="flex flex-col gap-6">
      {/* Brand Logotype */}
      <div className="flex items-center gap-3">
        <Mountain className="w-10 h-10 text-brand-gold" />
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold text-brand-slate leading-tight">
            The Mountain Pathway
          </h1>
          <p className="text-base text-brand-slate/70 leading-tight">
            Climb inward. Look upward.
          </p>
        </div>
      </div>

      {/* Progress Path */}
      <ProgressPath />
    </header>
  );
};
