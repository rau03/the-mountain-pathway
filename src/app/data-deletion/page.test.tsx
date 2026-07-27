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
});
