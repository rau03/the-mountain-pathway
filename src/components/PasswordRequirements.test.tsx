import React from "react";
import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import PasswordRequirements from "./PasswordRequirements";

describe("PasswordRequirements", () => {
  it("renders all five requirements as unmet for an empty password", () => {
    render(<PasswordRequirements password="" />);
    const list = screen.getByRole("list", { name: "Password requirements" });
    const items = within(list).getAllByRole("listitem");

    expect(items).toHaveLength(5);
    items.forEach((item) => {
      expect(item.className).toContain("text-gray-500");
      expect(item.className).not.toContain("text-green-600");
    });
  });

  it("marks individual requirements as met as the password satisfies them", () => {
    render(<PasswordRequirements password="Abc" />);
    const list = screen.getByRole("list", { name: "Password requirements" });

    const lengthItem = within(list).getByText("At least 8 characters").closest("li");
    const uppercaseItem = within(list)
      .getByText("One uppercase letter (A-Z)")
      .closest("li");
    const lowercaseItem = within(list)
      .getByText("One lowercase letter (a-z)")
      .closest("li");

    expect(lengthItem?.className).toContain("text-gray-500");
    expect(uppercaseItem?.className).toContain("text-green-600");
    expect(lowercaseItem?.className).toContain("text-green-600");
  });

  it("marks every requirement as met once the full policy is satisfied", () => {
    render(<PasswordRequirements password="Abcdefg1!" />);
    const list = screen.getByRole("list", { name: "Password requirements" });

    within(list)
      .getAllByRole("listitem")
      .forEach((item) => {
        expect(item.className).toContain("text-green-600");
      });
  });
});
