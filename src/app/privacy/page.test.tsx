import React from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import PrivacyPolicy from "./page";

(globalThis as { React: typeof React }).React = React;

vi.mock("@/lib/capacitorUtils", () => ({
  openExternalUrl: vi.fn(),
}));

describe("PrivacyPolicy page", () => {
  it("renders inside the Android-safe two-level scroll shell (outer overflow-hidden, inner overflow-y-auto)", () => {
    const { container } = render(<PrivacyPolicy />);

    const outerShell = container.firstElementChild as HTMLElement | null;
    const scrollOwner = outerShell?.firstElementChild as HTMLElement | null;

    expect(outerShell).not.toBeNull();
    expect(outerShell?.className).toContain("h-[100dvh]");
    expect(outerShell?.className).toContain("overflow-hidden");

    expect(scrollOwner).not.toBeNull();
    expect(scrollOwner?.className).toContain("overflow-y-auto");
    expect(scrollOwner?.className).toContain("overscroll-y-contain");
    expect(scrollOwner?.className).toContain("touch-pan-y");
  });

  it("renders the page heading and back link", () => {
    render(<PrivacyPolicy />);

    expect(
      screen.getByRole("heading", { name: "Privacy Policy" })
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /back to home/i })).toHaveAttribute(
      "href",
      "/"
    );
  });

  it("renders content through to the end of the page, including the Buy Me a Coffee link", () => {
    render(<PrivacyPolicy />);

    expect(
      screen.getByRole("heading", { name: "Changes to This Policy" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /buy me a coffee/i })
    ).toBeInTheDocument();
  });

  it("uses AA/AAA-compliant brand-navy (not brand-slate) for the heading and key text against bg-brand-stone", () => {
    render(<PrivacyPolicy />);

    const heading = screen.getByRole("heading", { name: "Privacy Policy" });
    expect(heading.className).toContain("text-brand-navy");
    expect(heading.className).not.toContain("text-brand-slate");

    const backLink = screen.getByRole("link", { name: /back to home/i });
    expect(backLink.className).toContain("text-brand-navy/85");
    expect(backLink.className).toContain("hover:text-brand-navy");
    expect(backLink.className).not.toContain("text-brand-slate");

    const coffeeLink = screen.getByRole("link", { name: /buy me a coffee/i });
    expect(coffeeLink.className).toContain("text-brand-navy/85");
    expect(coffeeLink.className).not.toContain("text-brand-slate");
  });
});
