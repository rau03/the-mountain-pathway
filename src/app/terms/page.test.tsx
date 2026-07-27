import React from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import TermsOfService from "./page";

(globalThis as { React: typeof React }).React = React;

vi.mock("@/lib/capacitorUtils", () => ({
  openExternalUrl: vi.fn(),
}));

describe("TermsOfService page", () => {
  it("renders inside the Android-safe two-level scroll shell (outer overflow-hidden, inner overflow-y-auto)", () => {
    const { container } = render(<TermsOfService />);

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
    render(<TermsOfService />);

    expect(
      screen.getByRole("heading", { name: "Terms of Service" })
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /back to home/i })).toHaveAttribute(
      "href",
      "/"
    );
  });

  it("makes the Scripture Credits section reachable in the DOM", () => {
    render(<TermsOfService />);

    expect(
      screen.getByRole("heading", { name: "Scripture Credits" })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/The King James Version \(KJV\) is in the public domain\./)
    ).toBeInTheDocument();
  });

  it("makes the Lockman.org attribution link reachable in the DOM", () => {
    render(<TermsOfService />);

    const lockmanLink = screen.getByRole("link", { name: "www.lockman.org" });
    expect(lockmanLink).toBeInTheDocument();
    expect(lockmanLink).toHaveAttribute("href", "https://www.lockman.org");
  });

  it("renders the Buy Me a Coffee link at the end of the content", () => {
    render(<TermsOfService />);

    expect(
      screen.getByRole("link", { name: /buy me a coffee/i })
    ).toBeInTheDocument();
  });

  it("uses AA/AAA-compliant brand-navy (not brand-slate) for the heading and key text against bg-brand-stone", () => {
    render(<TermsOfService />);

    const heading = screen.getByRole("heading", { name: "Terms of Service" });
    expect(heading.className).toContain("text-brand-navy");
    expect(heading.className).not.toContain("text-brand-slate");

    const backLink = screen.getByRole("link", { name: /back to home/i });
    expect(backLink.className).toContain("text-brand-navy/85");
    expect(backLink.className).toContain("hover:text-brand-navy");
    expect(backLink.className).not.toContain("text-brand-slate");

    const coffeeLink = screen.getByRole("link", { name: /buy me a coffee/i });
    expect(coffeeLink.className).toContain("text-brand-navy/85");
    expect(coffeeLink.className).not.toContain("text-brand-slate");

    const lockmanLink = screen.getByRole("link", { name: "www.lockman.org" });
    expect(lockmanLink.className).toContain("text-brand-navy");
    expect(lockmanLink.className).not.toContain("text-brand-slate");
  });
});
