import React from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import DataDeletion from "./page";

(globalThis as { React: typeof React }).React = React;

vi.mock("@/lib/capacitorUtils", () => ({
  openExternalUrl: vi.fn(),
}));

describe("DataDeletion page", () => {
  it("renders inside the Android-safe two-level scroll shell (outer overflow-hidden, inner overflow-y-auto)", () => {
    const { container } = render(<DataDeletion />);

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
    render(<DataDeletion />);

    expect(
      screen.getByRole("heading", { name: "Data Deletion Policy" })
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /back to home/i })).toHaveAttribute(
      "href",
      "/"
    );
  });

  it("renders content through to the end of the page, including the Buy Me a Coffee link", () => {
    render(<DataDeletion />);

    expect(
      screen.getByRole("heading", { name: "Questions?" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /buy me a coffee/i })
    ).toBeInTheDocument();
  });

  it("uses AA/AAA-compliant brand-navy (not brand-slate/brand-gold) for the heading, key text, and section icons against bg-brand-stone", () => {
    const { container } = render(<DataDeletion />);

    const heading = screen.getByRole("heading", {
      name: "Data Deletion Policy",
    });
    expect(heading.className).toContain("text-brand-navy");
    expect(heading.className).not.toContain("text-brand-slate");

    const backLink = screen.getByRole("link", { name: /back to home/i });
    expect(backLink.className).toContain("text-brand-navy/85");
    expect(backLink.className).toContain("hover:text-brand-navy");
    expect(backLink.className).not.toContain("text-brand-slate");

    const coffeeLink = screen.getByRole("link", { name: /buy me a coffee/i });
    expect(coffeeLink.className).toContain("text-brand-navy/85");
    expect(coffeeLink.className).not.toContain("text-brand-slate");

    // The Shield/Trash2/Mail/Clock section icons previously used
    // text-brand-gold (1.12:1 against bg-brand-stone, failing badly) and
    // now use text-brand-navy (10.72:1, AAA).
    const icons = container.querySelectorAll("svg");
    expect(icons.length).toBeGreaterThan(0);
    const iconClasses = Array.from(icons).map((icon) => icon.getAttribute("class") ?? "");
    expect(iconClasses.some((cls) => cls.includes("text-brand-navy"))).toBe(true);
    expect(iconClasses.some((cls) => cls.includes("text-brand-gold"))).toBe(false);
  });
});
