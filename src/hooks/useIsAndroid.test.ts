import { describe, expect, it, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useIsAndroid } from "./useIsAndroid";

const mockGetPlatform = vi.fn();

vi.mock("@/lib/capacitorUtils", () => ({
  getPlatform: (...args: unknown[]) => mockGetPlatform(...args),
}));

beforeEach(() => {
  mockGetPlatform.mockReset();
});

describe("useIsAndroid", () => {
  it("returns true when the platform is android", () => {
    mockGetPlatform.mockReturnValue("android");

    const { result } = renderHook(() => useIsAndroid());

    expect(result.current).toBe(true);
  });

  it("returns false when the platform is ios", () => {
    mockGetPlatform.mockReturnValue("ios");

    const { result } = renderHook(() => useIsAndroid());

    expect(result.current).toBe(false);
  });

  it("returns false when the platform is web", () => {
    mockGetPlatform.mockReturnValue("web");

    const { result } = renderHook(() => useIsAndroid());

    expect(result.current).toBe(false);
  });
});
