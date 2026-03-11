import React from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ReflectionScreen } from "./ReflectionScreen";
import type { PathwayStep } from "@/lib/pathway-data";

describe("ReflectionScreen psalm formatting", () => {
  it("applies hanging-indent verse class and keeps attribution style separate", () => {
    const step: PathwayStep = {
      stepIndex: 1,
      stageName: "Ascent",
      title: "Ground Yourself In Scripture",
      subtitle: "Listen to His Word",
      type: "reflection",
      prompt: "Prompt",
      icon: "BookOpen",
      content: {
        scripture:
          "You know when I sit down or stand up.\nYou know my thoughts even when I am far away.\n\n-- Psalm 139 (NLT)",
      },
      isInput: false,
      key: "reflect",
    };

    render(<ReflectionScreen step={step} />);

    const verse = screen.getByText("You know when I sit down or stand up.");
    const attribution = screen.getByText("-- Psalm 139 (NLT)");

    expect(verse.className).toContain("psalm-verse");
    expect(verse.className).toContain("whitespace-pre-line");
    expect(attribution.className).toContain("text-right");
    expect(attribution.className).not.toContain("psalm-verse");
  });
});
