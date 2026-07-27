import React from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import LegalPageLayout from "./LegalPageLayout";

describe("LegalPageLayout", () => {
  it("renders a non-scrolling outer shell matching MobileJourneyLayout's proven pattern", () => {
    const { container } = render(
      <LegalPageLayout>
        <p>Legal content</p>
      </LegalPageLayout>
    );

    const outerShell = container.firstElementChild as HTMLElement | null;

    expect(outerShell).not.toBeNull();
    expect(outerShell?.className).toContain("h-[100dvh]");
    expect(outerShell?.className).toContain("overflow-hidden");
    expect(outerShell?.className).toContain("flex");
    expect(outerShell?.className).toContain("flex-col");
  });

  it("makes the inner flex child the actual scroll owner, not the outer shell", () => {
    const { container } = render(
      <LegalPageLayout>
        <p>Legal content</p>
      </LegalPageLayout>
    );

    const outerShell = container.firstElementChild as HTMLElement | null;
    const scrollOwner = outerShell?.firstElementChild as HTMLElement | null;

    expect(scrollOwner).not.toBeNull();
    expect(scrollOwner?.className).toContain("flex-grow");
    expect(scrollOwner?.className).toContain("min-h-0");
    expect(scrollOwner?.className).toContain("overflow-y-auto");
    expect(scrollOwner?.className).toContain("overscroll-y-contain");

    // The outer shell itself must not double up as a scroll container.
    expect(outerShell?.className).not.toContain("overflow-y-auto");
  });

  it("adds touch-pan-y to the scroll owner as defensive insurance for Android touch handling", () => {
    const { container } = render(
      <LegalPageLayout>
        <p>Legal content</p>
      </LegalPageLayout>
    );

    const outerShell = container.firstElementChild as HTMLElement | null;
    const scrollOwner = outerShell?.firstElementChild as HTMLElement | null;

    expect(scrollOwner?.className).toContain("touch-pan-y");
  });

  it("preserves the existing min-h-screen / max-w-3xl styling nested inside the scroll owner", () => {
    render(
      <LegalPageLayout>
        <p>Legal content</p>
      </LegalPageLayout>
    );

    const content = screen.getByText("Legal content");
    const maxWidthWrapper = content.parentElement;
    const minHeightWrapper = content.parentElement?.parentElement;

    expect(maxWidthWrapper?.className).toContain("max-w-3xl");
    expect(maxWidthWrapper?.className).toContain("mx-auto");
    expect(maxWidthWrapper?.className).toContain("px-6");
    expect(maxWidthWrapper?.className).toContain("py-12");

    expect(minHeightWrapper?.className).toContain("min-h-screen");
    expect(minHeightWrapper?.className).toContain("bg-brand-stone");
  });

  it("renders children content", () => {
    render(
      <LegalPageLayout>
        <p>Unique legal text</p>
      </LegalPageLayout>
    );

    expect(screen.getByText("Unique legal text")).toBeInTheDocument();
  });
});
