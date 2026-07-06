import { afterEach, describe, expect, it, vi } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import { useOnlineStatus } from "./useOnlineStatus";

const setNavigatorOnLine = (value: boolean) => {
  Object.defineProperty(window.navigator, "onLine", {
    configurable: true,
    value,
  });
};

const mockIsNativePlatform = vi.fn(() => false);
const mockGetStatus = vi.fn();
const mockAddListener = vi.fn();
const mockRemove = vi.fn();

vi.mock("@capacitor/core", () => ({
  Capacitor: {
    isNativePlatform: () => mockIsNativePlatform(),
  },
}));

vi.mock("@capacitor/network", () => ({
  Network: {
    getStatus: (...args: unknown[]) => mockGetStatus(...args),
    addListener: (...args: unknown[]) => mockAddListener(...args),
  },
}));

afterEach(() => {
  // Restore the jsdom default (online) between tests.
  setNavigatorOnLine(true);
  mockIsNativePlatform.mockReturnValue(false);
  mockGetStatus.mockReset();
  mockAddListener.mockReset();
  mockRemove.mockReset();
  vi.restoreAllMocks();
});

describe("useOnlineStatus", () => {
  describe("web path", () => {
    it("reads the current navigator.onLine value on mount", () => {
      setNavigatorOnLine(false);

      const { result } = renderHook(() => useOnlineStatus());

      expect(result.current.isOnline).toBe(false);
    });

    it("defaults to online when navigator.onLine is true", () => {
      setNavigatorOnLine(true);

      const { result } = renderHook(() => useOnlineStatus());

      expect(result.current.isOnline).toBe(true);
    });

    it("responds to offline and online window events", () => {
      setNavigatorOnLine(true);

      const { result } = renderHook(() => useOnlineStatus());
      expect(result.current.isOnline).toBe(true);

      act(() => {
        window.dispatchEvent(new Event("offline"));
      });
      expect(result.current.isOnline).toBe(false);

      act(() => {
        window.dispatchEvent(new Event("online"));
      });
      expect(result.current.isOnline).toBe(true);
    });

    it("removes its event listeners on unmount", () => {
      const removeSpy = vi.spyOn(window, "removeEventListener");

      const { unmount } = renderHook(() => useOnlineStatus());
      unmount();

      expect(removeSpy).toHaveBeenCalledWith("online", expect.any(Function));
      expect(removeSpy).toHaveBeenCalledWith("offline", expect.any(Function));
    });
  });

  describe("native path", () => {
    it("reads the initial status from Network.getStatus()", async () => {
      mockIsNativePlatform.mockReturnValue(true);
      mockGetStatus.mockResolvedValue({ connected: true, connectionType: "wifi" });
      mockAddListener.mockResolvedValue({ remove: mockRemove });

      const { result } = renderHook(() => useOnlineStatus());

      await waitFor(() => {
        expect(mockGetStatus).toHaveBeenCalled();
      });
      await waitFor(() => {
        expect(result.current.isOnline).toBe(true);
      });
    });

    it("updates to offline when networkStatusChange fires with connected: false", async () => {
      mockIsNativePlatform.mockReturnValue(true);
      mockGetStatus.mockResolvedValue({ connected: true, connectionType: "wifi" });
      let statusChangeCallback: (status: { connected: boolean }) => void = () => {};
      mockAddListener.mockImplementation((_event: string, callback: (status: { connected: boolean }) => void) => {
        statusChangeCallback = callback;
        return Promise.resolve({ remove: mockRemove });
      });

      const { result } = renderHook(() => useOnlineStatus());

      await waitFor(() => {
        expect(result.current.isOnline).toBe(true);
      });

      act(() => {
        statusChangeCallback({ connected: false });
      });

      expect(result.current.isOnline).toBe(false);
    });

    it("updates to online when networkStatusChange fires with connected: true", async () => {
      mockIsNativePlatform.mockReturnValue(true);
      mockGetStatus.mockResolvedValue({ connected: false, connectionType: "none" });
      let statusChangeCallback: (status: { connected: boolean }) => void = () => {};
      mockAddListener.mockImplementation((_event: string, callback: (status: { connected: boolean }) => void) => {
        statusChangeCallback = callback;
        return Promise.resolve({ remove: mockRemove });
      });

      const { result } = renderHook(() => useOnlineStatus());

      await waitFor(() => {
        expect(result.current.isOnline).toBe(false);
      });

      act(() => {
        statusChangeCallback({ connected: true });
      });

      expect(result.current.isOnline).toBe(true);
    });

    it("removes the network listener on unmount", async () => {
      mockIsNativePlatform.mockReturnValue(true);
      mockGetStatus.mockResolvedValue({ connected: true, connectionType: "wifi" });
      mockAddListener.mockResolvedValue({ remove: mockRemove });

      const { unmount } = renderHook(() => useOnlineStatus());

      await waitFor(() => {
        expect(mockAddListener).toHaveBeenCalled();
      });

      unmount();

      await waitFor(() => {
        expect(mockRemove).toHaveBeenCalled();
      });
    });
  });
});
