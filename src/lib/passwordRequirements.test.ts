import { describe, expect, it } from "vitest";
import {
  getPasswordRequirementStatus,
  isPasswordValid,
  PASSWORD_REQUIREMENTS,
} from "./passwordRequirements";

describe("passwordRequirements", () => {
  it("defines the confirmed Supabase policy: length, uppercase, lowercase, number, symbol", () => {
    expect(PASSWORD_REQUIREMENTS.map((r) => r.id)).toEqual([
      "length",
      "uppercase",
      "lowercase",
      "number",
      "symbol",
    ]);
  });

  it("reports each requirement's met/unmet status live for a given password", () => {
    const status = getPasswordRequirementStatus("abc");
    expect(status.find((r) => r.id === "length")?.met).toBe(false);
    expect(status.find((r) => r.id === "lowercase")?.met).toBe(true);
    expect(status.find((r) => r.id === "uppercase")?.met).toBe(false);
    expect(status.find((r) => r.id === "number")?.met).toBe(false);
    expect(status.find((r) => r.id === "symbol")?.met).toBe(false);
  });

  it("marks a password valid only once every requirement is satisfied", () => {
    expect(isPasswordValid("")).toBe(false);
    expect(isPasswordValid("alllowercase")).toBe(false);
    expect(isPasswordValid("ALLUPPERCASE1!")).toBe(false); // missing lowercase
    expect(isPasswordValid("Abcdefg1")).toBe(false); // missing symbol
    expect(isPasswordValid("Abcdefg!")).toBe(false); // missing number
    expect(isPasswordValid("Abc1!")).toBe(false); // too short
    expect(isPasswordValid("Abcdefg1!")).toBe(true);
  });

  it("does not count whitespace as satisfying the symbol requirement", () => {
    expect(isPasswordValid("Abcdefg 1")).toBe(false);
  });
});
