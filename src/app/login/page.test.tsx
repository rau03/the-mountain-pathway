import React from "react";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import LoginPage from "./page";

(globalThis as { React: typeof React }).React = React;

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock("@supabase/auth-helpers-react", () => ({
  useUser: () => null,
}));

vi.mock("../../lib/supabaseClient", () => ({
  default: {
    auth: {
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      resetPasswordForEmail: vi.fn(),
    },
  },
}));

vi.mock("@/lib/capacitorUtils", () => ({
  openExternalUrl: vi.fn(),
}));

vi.mock("@/lib/authRedirect", () => ({
  getEmailRedirectTo: () => "https://themountainpathway.com/auth/callback",
  getPublicSiteUrl: () => "https://themountainpathway.com",
}));

describe("LoginPage iOS autofill semantics", () => {
  it("uses username/current-password autofill pair and 44px+ auth actions", () => {
    render(<LoginPage />);

    const email = screen.getByPlaceholderText("you@example.com");
    const password = screen.getByPlaceholderText("Your password");
    const forgotPassword = screen.getByRole("button", { name: "Forgot password?" });
    const login = screen.getByRole("button", { name: "Log In" });

    expect(email).toHaveAttribute("name", "email");
    expect(email).toHaveAttribute("autocomplete", "username");
    expect(email).toHaveAttribute("autocapitalize", "none");
    expect(email).toHaveAttribute("autocorrect", "off");
    expect(password).toHaveAttribute("name", "password");
    expect(password).toHaveAttribute("autocomplete", "current-password");
    expect(password).toHaveAttribute("autocapitalize", "none");
    expect(password).toHaveAttribute("autocorrect", "off");
    expect(forgotPassword.className).toContain("min-h-11");
    expect(login.className).toContain("min-h-11");
  });
});

describe("LoginPage password requirements checklist and visibility toggle", () => {
  it("does not show a checklist on the login form, but toggles password visibility", () => {
    render(<LoginPage />);

    expect(
      screen.queryByRole("list", { name: "Password requirements" })
    ).not.toBeInTheDocument();

    const password = screen.getByPlaceholderText("Your password");
    expect(password).toHaveAttribute("type", "password");
    fireEvent.click(screen.getByRole("button", { name: "Show password" }));
    expect(password).toHaveAttribute("type", "text");
  });

  it("shows a live checklist on signup that updates as the password is typed", () => {
    render(<LoginPage />);

    fireEvent.click(screen.getByRole("button", { name: "Sign up" }));

    const checklist = screen.getByRole("list", { name: "Password requirements" });
    expect(within(checklist).getByText("At least 8 characters")).toBeInTheDocument();

    const password = screen.getByPlaceholderText("at least 8 characters.");
    fireEvent.change(password, { target: { value: "Abcdefg1!" } });

    within(checklist)
      .getAllByRole("listitem")
      .forEach((item) => {
        expect(item.className).toContain("text-green-600");
      });

    fireEvent.click(screen.getByRole("button", { name: "Show password" }));
    expect(password).toHaveAttribute("type", "text");
  });
});
