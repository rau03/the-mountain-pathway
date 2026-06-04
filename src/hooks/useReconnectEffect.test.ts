import { afterEach, describe, expect, it, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useReconnectEffect } from "./useReconnectEffect";

const mockUseOnlineStatus = vi.fn();

vi.mock("./useOnlineStatus", () => ({
  useOnlineStatus: () => mockUseOnlineStatus(),
}));

afterEach(() => {
  vi.clearAllMocks();
});

describe("useReconnectEffect", () => {
  it("does NOT fire onReconnect on initial mount when online", () => {
    mockUseOnlineStatus.mockReturnValue({ isOnline: true });
    const onReconnect = vi.fn();

    renderHook(() => useReconnectEffect(onReconnect));

    expect(onReconnect).not.toHaveBeenCalled();
  });

  it("does NOT fire onReconnect on initial mount when offline", () => {
    mockUseOnlineStatus.mockReturnValue({ isOnline: false });
    const onReconnect = vi.fn();

    renderHook(() => useReconnectEffect(onReconnect));

    expect(onReconnect).not.toHaveBeenCalled();
  });

  it("fires onReconnect exactly once on offline→online transition", () => {
    mockUseOnlineStatus.mockReturnValue({ isOnline: false });
    const onReconnect = vi.fn();

    const { rerender } = renderHook(() => useReconnectEffect(onReconnect));
    expect(onReconnect).not.toHaveBeenCalled();

    mockUseOnlineStatus.mockReturnValue({ isOnline: true });
    rerender();

    expect(onReconnect).toHaveBeenCalledTimes(1);
  });

  it("does NOT fire onReconnect on online→offline transition", () => {
    mockUseOnlineStatus.mockReturnValue({ isOnline: true });
    const onReconnect = vi.fn();

    const { rerender } = renderHook(() => useReconnectEffect(onReconnect));

    mockUseOnlineStatus.mockReturnValue({ isOnline: false });
    rerender();

    expect(onReconnect).not.toHaveBeenCalled();
  });

  it("does NOT fire onReconnect on online→online (no transition)", () => {
    mockUseOnlineStatus.mockReturnValue({ isOnline: true });
    const onReconnect = vi.fn();

    const { rerender } = renderHook(() => useReconnectEffect(onReconnect));

    mockUseOnlineStatus.mockReturnValue({ isOnline: true });
    rerender();

    expect(onReconnect).not.toHaveBeenCalled();
  });

  it("cleans up correctly on unmount", () => {
    mockUseOnlineStatus.mockReturnValue({ isOnline: true });
    const onReconnect = vi.fn();

    const { unmount } = renderHook(() => useReconnectEffect(onReconnect));

    expect(() => unmount()).not.toThrow();
    expect(onReconnect).not.toHaveBeenCalled();
  });
});
