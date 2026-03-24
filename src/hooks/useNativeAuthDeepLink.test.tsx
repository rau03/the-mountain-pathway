import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import { detectRawResetIntent, useNativeAuthDeepLink } from "./useNativeAuthDeepLink";

const getLaunchUrlMock = vi.fn();
const addListenerMock = vi.fn();
const exchangeCodeForSessionMock = vi.fn();
const setSessionMock = vi.fn();
const verifyOtpMock = vi.fn();

vi.mock("@capacitor/app", () => ({
  App: {
    getLaunchUrl: (...args: unknown[]) => getLaunchUrlMock(...args),
    addListener: (...args: unknown[]) => addListenerMock(...args),
  },
}));

vi.mock("@/lib/capacitorUtils", () => ({
  isNativeApp: () => true,
}));

vi.mock("@/lib/supabaseClient", () => ({
  default: {
    auth: {
      exchangeCodeForSession: (...args: unknown[]) =>
        exchangeCodeForSessionMock(...args),
      setSession: (...args: unknown[]) => setSessionMock(...args),
      verifyOtp: (...args: unknown[]) => verifyOtpMock(...args),
    },
  },
}));

describe("detectRawResetIntent", () => {
  it("detects reset intent for /auth/callback/recovery", () => {
    const result = detectRawResetIntent(
      "https://themountainpathway.com/auth/callback/recovery?type=recovery"
    );
    expect(result).toEqual({ isResetIntent: true, tokenHash: undefined });
  });

  it("detects reset intent and token hash for /auth/confirm", () => {
    const result = detectRawResetIntent(
      "https://themountainpathway.com/auth/confirm?type=recovery&token_hash=abc123"
    );
    expect(result).toEqual({ isResetIntent: true, tokenHash: "abc123" });
  });

  it("detects reset intent from next query param", () => {
    const result = detectRawResetIntent(
      "https://themountainpathway.com/auth/callback?next=%2Freset-password"
    );
    expect(result).toEqual({ isResetIntent: true, tokenHash: undefined });
  });
});

describe("useNativeAuthDeepLink cold-start recovery handling", () => {
  beforeEach(() => {
    getLaunchUrlMock.mockReset();
    addListenerMock.mockReset();
    exchangeCodeForSessionMock.mockReset();
    setSessionMock.mockReset();
    verifyOtpMock.mockReset();

    addListenerMock.mockResolvedValue({ remove: vi.fn() });
    verifyOtpMock.mockResolvedValue({ data: {}, error: null });
  });

  it("handles universal-link recovery cold start via /auth/callback/recovery", async () => {
    getLaunchUrlMock.mockResolvedValue({
      url: "https://themountainpathway.com/auth/callback/recovery?type=recovery",
    });

    const { result } = renderHook(() => useNativeAuthDeepLink(null));

    await waitFor(() => {
      expect(result.current.showNativeResetPassword).toBe(true);
    });
    expect(verifyOtpMock).not.toHaveBeenCalled();
  });

  it("verifies token_hash on /auth/confirm then opens reset screen", async () => {
    getLaunchUrlMock.mockResolvedValue({
      url: "https://themountainpathway.com/auth/confirm?type=recovery&token_hash=test_hash",
    });

    const { result } = renderHook(() => useNativeAuthDeepLink(null));

    await waitFor(() => {
      expect(result.current.showNativeResetPassword).toBe(true);
    });
    expect(verifyOtpMock).toHaveBeenCalledWith({
      token_hash: "test_hash",
      type: "recovery",
    });
  });

  it("handles universal-link reset intent from next=/reset-password", async () => {
    getLaunchUrlMock.mockResolvedValue({
      url: "https://themountainpathway.com/auth/callback?next=%2Freset-password",
    });

    const { result } = renderHook(() => useNativeAuthDeepLink(null));

    await waitFor(() => {
      expect(result.current.showNativeResetPassword).toBe(true);
    });
    expect(verifyOtpMock).not.toHaveBeenCalled();
  });

  it("handles reset intent from appUrlOpen TO JS event", async () => {
    let appUrlOpenHandler: ((event: { url: string }) => void) | null = null;
    addListenerMock.mockImplementation(async (eventName: string, handler: unknown) => {
      if (eventName === "appUrlOpen") {
        appUrlOpenHandler = handler as (event: { url: string }) => void;
      }
      return { remove: vi.fn() };
    });
    getLaunchUrlMock.mockResolvedValue({ url: null });

    const { result } = renderHook(() => useNativeAuthDeepLink(null));

    await waitFor(() => {
      expect(appUrlOpenHandler).not.toBeNull();
    });

    act(() => {
      appUrlOpenHandler?.({
        url: "https://themountainpathway.com/auth/confirm?token_hash=event_hash&type=recovery&next=%2Freset-password",
      });
    });

    await waitFor(() => {
      expect(result.current.showNativeResetPassword).toBe(true);
    });
    expect(verifyOtpMock).toHaveBeenCalledWith({
      token_hash: "event_hash",
      type: "recovery",
    });
  });
});
