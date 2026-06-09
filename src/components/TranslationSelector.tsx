import React from "react";
import { useStore } from "@/lib/store/useStore";
import type { BibleTranslation } from "@/lib/psalm139";

const TRANSLATIONS: BibleTranslation[] = ["KJV", "ESV", "NLT", "NASB", "CSB"];

export const TranslationSelector: React.FC = () => {
  const { bibleTranslation, setBibleTranslation } = useStore();

  return (
    <div className="flex flex-row gap-2 flex-wrap justify-center">
      {TRANSLATIONS.map((translation) => {
        const isActive = translation === bibleTranslation;
        const pillClass = isActive
          ? "bg-brand-gold text-slate-900 rounded-full px-3 py-1.5"
          : "bg-black/20 backdrop-blur-sm text-white border border-white/20 rounded-full px-3 py-1.5 hover:bg-black/30";

        return (
          <button
            key={translation}
            type="button"
            onClick={() => setBibleTranslation(translation)}
            aria-pressed={isActive}
            className={`text-xs font-semibold transition-colors cursor-pointer ${pillClass}`}
          >
            {translation}
          </button>
        );
      })}
    </div>
  );
};
