import React from "react";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import PasswordInput from "./PasswordInput";

describe("PasswordInput", () => {
  it("renders as a password field by default with a 'Show password' toggle", () => {
    render(<PasswordInput id="pw" value="secret" onChange={() => {}} />);
    const input = screen.getByDisplayValue("secret");
    expect(input).toHaveAttribute("type", "password");
    expect(
      screen.getByRole("button", { name: "Show password" })
    ).toBeInTheDocument();
  });

  it("toggles to type=text and an updated label when clicked", () => {
    render(<PasswordInput id="pw" value="secret" onChange={() => {}} />);
    const input = screen.getByDisplayValue("secret");

    fireEvent.click(screen.getByRole("button", { name: "Show password" }));
    expect(input).toHaveAttribute("type", "text");
    expect(
      screen.getByRole("button", { name: "Hide password" })
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Hide password" }));
    expect(input).toHaveAttribute("type", "password");
  });

  it("forwards standard input props and always disables autocapitalize/autocorrect", () => {
    const handleChange = vi.fn();
    render(
      <PasswordInput
        id="pw"
        name="password"
        value=""
        onChange={handleChange}
        placeholder="Your password"
        autoComplete="new-password"
        disabled={false}
      />
    );

    const input = screen.getByPlaceholderText("Your password");
    expect(input).toHaveAttribute("name", "password");
    expect(input).toHaveAttribute("autocomplete", "new-password");
    expect(input).toHaveAttribute("autocapitalize", "none");
    expect(input).toHaveAttribute("autocorrect", "off");

    fireEvent.change(input, { target: { value: "a" } });
    expect(handleChange).toHaveBeenCalled();
  });

  it("disables the toggle button when the input is disabled", () => {
    render(<PasswordInput id="pw" value="" onChange={() => {}} disabled />);
    expect(screen.getByRole("button", { name: "Show password" })).toBeDisabled();
  });
});
