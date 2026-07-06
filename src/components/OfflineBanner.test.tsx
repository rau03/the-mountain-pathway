import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { OfflineBanner } from "./OfflineBanner";

const mockUseOnlineStatus = vi.fn();
const mockIsNativePlatform = vi.fn(() => false);
const mockGetStatusBarInfo = vi.fn();

vi.mock("@/hooks/useOnlineStatus", () => ({
  useOnlineStatus: () => mockUseOnlineStatus(),
}));

vi.mock("@capacitor/core", () => ({
  Capacitor: {
    isNativePlatform: () => mockIsNativePlatform(),
  },
}));

vi.mock("@capacitor/status-bar", () => ({
  StatusBar: {
    getInfo: (...args: unknown[]) => mockGetStatusBarInfo(...args),
  },
}));

afterEach(() => {
  mockIsNativePlatform.mockReturnValue(false);
  mockGetStatusBarInfo.mockReset();
  vi.clearAllMocks();
});

describe("OfflineBanner", () => {
  it("applies top: 0px when not on a native platform", async () => {
    mockUseOnlineStatus.mockReturnValue({ isOnline: false });
    mockIsNativePlatform.mockReturnValue(false);

    render(<OfflineBanner />);

    const banner = screen.getByRole("status");
    expect(banner).toHaveStyle({ top: "0px" });
  });

  it("applies the resolved native status bar height as top", async () => {
    mockUseOnlineStatus.mockReturnValue({ isOnline: false });
    mockIsNativePlatform.mockReturnValue(true);
    mockGetStatusBarInfo.mockResolvedValue({
      visible: true,
      style: "DEFAULT",
      color: "#000000",
      overlays: true,
      height: 32,
    });

    render(<OfflineBanner />);

    await waitFor(() => {
      expect(screen.getByRole("status")).toHaveStyle({ top: "32px" });
    });
  });

  it("falls back to top: 0px when StatusBar.getInfo() rejects", async () => {
    mockUseOnlineStatus.mockReturnValue({ isOnline: false });
    mockIsNativePlatform.mockReturnValue(true);
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    mockGetStatusBarInfo.mockRejectedValue(new Error("native bridge unavailable"));

    render(<OfflineBanner />);

    await waitFor(() => {
      expect(mockGetStatusBarInfo).toHaveBeenCalled();
    });

    expect(screen.getByRole("status")).toHaveStyle({ top: "0px" });
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Failed to read status bar height:",
      expect.any(Error),
    );
  });
});
