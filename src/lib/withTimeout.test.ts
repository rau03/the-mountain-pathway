import { afterEach, describe, expect, it, vi } from "vitest";
import { withTimeout } from "./withTimeout";

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("withTimeout", () => {
  it("resolves with the value when the promise resolves before the timeout", async () => {
    const result = await withTimeout(Promise.resolve("done"), 15000, "Test");
    expect(result).toBe("done");
  });

  it("rejects with a timeout error when the promise takes longer than ms", async () => {
    vi.useFakeTimers();

    // A promise that never settles on its own.
    const pending = new Promise<string>(() => {});
    const wrapped = withTimeout(pending, 15000, "Save journey");

    const assertion = expect(wrapped).rejects.toThrow(
      "Save journey timed out. Please check your connection and try again."
    );

    await vi.advanceTimersByTimeAsync(15000);
    await assertion;
  });

  it("clears the timer when the promise resolves early (no leaked timers)", async () => {
    vi.useFakeTimers();
    const clearSpy = vi.spyOn(globalThis, "clearTimeout");

    await withTimeout(Promise.resolve("ok"), 15000, "Test");

    expect(clearSpy).toHaveBeenCalled();
    expect(vi.getTimerCount()).toBe(0);
  });

  it("uses the provided label in the timeout error message", async () => {
    vi.useFakeTimers();

    const pending = new Promise<number>(() => {});
    const wrapped = withTimeout(pending, 1000, "Load journeys");

    const assertion = expect(wrapped).rejects.toThrow(
      "Load journeys timed out. Please check your connection and try again."
    );

    await vi.advanceTimersByTimeAsync(1000);
    await assertion;
  });

  it("uses the 15000ms default when no ms is provided", async () => {
    vi.useFakeTimers();

    const pending = new Promise<string>(() => {});
    const wrapped = withTimeout(pending);

    let settled = false;
    wrapped.catch(() => {
      settled = true;
    });

    // Just before the default deadline: still pending.
    await vi.advanceTimersByTimeAsync(14999);
    expect(settled).toBe(false);

    // Crossing 15000ms: rejects.
    const assertion = expect(wrapped).rejects.toThrow(
      "Request timed out. Please check your connection and try again."
    );
    await vi.advanceTimersByTimeAsync(1);
    await assertion;
  });
});
