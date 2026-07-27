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
});
