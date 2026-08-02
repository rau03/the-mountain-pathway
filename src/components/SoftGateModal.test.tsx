import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import SoftGateModal from "./SoftGateModal";

const signUpMock = vi.fn();

vi.mock("@/lib/supabaseClient", () => ({
  default: {
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
      onAuthStateChange: vi.fn().mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } },
      }),
      signInWithPassword: vi.fn(),
      signUp: (...args: unknown[]) => signUpMock(...args),
      resetPasswordForEmail: vi.fn(),
    },
  },
}));

describe("SoftGateModal duplicate signup handling", () => {
  beforeEach(() => {
    signUpMock.mockReset();
  });

  it("shows duplicate-email message on login and prefills email", async () => {
    signUpMock.mockResolvedValue({
      data: { user: { identities: [] } },
      error: null,
    });

    render(
      <SoftGateModal
        open={true}
        onOpenChange={() => {}}
        onContinueAsGuest={() => {}}
        onAuthComplete={() => {}}
      />
    );

    fireEvent.click(
      screen.getByRole("button", { name: /Yes, create my free account/i })
    );

    expect(screen.getByLabelText("First Name")).toHaveAttribute("name", "firstName");
    expect(screen.getByLabelText("Email")).toHaveAttribute("name", "email");
    expect(screen.getByLabelText("Email")).toHaveAttribute("autocomplete", "email");
    expect(screen.getByLabelText("Email")).toHaveAttribute(
      "autocapitalize",
      "none"
    );
    expect(screen.getByLabelText("Email")).toHaveAttribute("autocorrect", "off");
    expect(screen.getByLabelText("Password")).toHaveAttribute("name", "password");
    expect(screen.getByLabelText("Password")).toHaveAttribute(
      "autocapitalize",
      "none"
    );
    expect(screen.getByLabelText("Password")).toHaveAttribute(
      "autocorrect",
      "off"
    );

    fireEvent.change(screen.getByLabelText("First Name"), {
      target: { value: "Chris" },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "existing@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "Abcdefg1!" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Create Account" }));

    expect(
      await screen.findByText(
        "This email address is already connected to an account. Please log in or choose Forgot password."
      )
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Welcome Back" })).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toHaveValue("existing@example.com");
    expect(screen.getByLabelText("Email")).toHaveAttribute(
      "autocomplete",
      "username"
    );
    expect(screen.getByLabelText("Email")).toHaveAttribute(
      "autocapitalize",
      "none"
    );
    expect(screen.getByLabelText("Email")).toHaveAttribute("autocorrect", "off");
    expect(screen.getByLabelText("Password")).toHaveAttribute(
      "autocomplete",
      "current-password"
    );
  });

  it("maps duplicate email with code-based Supabase errors", async () => {
    signUpMock.mockResolvedValue({
      data: { user: null },
      error: {
        message: "Use another email",
        code: "user_already_exists",
      },
    });

    render(
      <SoftGateModal
        open={true}
        onOpenChange={() => {}}
        onContinueAsGuest={() => {}}
        onAuthComplete={() => {}}
      />
    );

    fireEvent.click(
      screen.getByRole("button", { name: /Yes, create my free account/i })
    );
    fireEvent.change(screen.getByLabelText("First Name"), {
      target: { value: "Chris" },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "existing2@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "Abcdefg1!" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Create Account" }));

    expect(
      await screen.findByText(
        "This email address is already connected to an account. Please log in or choose Forgot password."
      )
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Welcome Back" })).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toHaveValue("existing2@example.com");
  });
});

describe("SoftGateModal password requirements checklist and visibility toggle", () => {
  beforeEach(() => {
    signUpMock.mockReset();
  });

  it("shows a live checklist on signup that updates as the password is typed, but not on login", () => {
    render(
      <SoftGateModal
        open={true}
        onOpenChange={() => {}}
        onContinueAsGuest={() => {}}
        onAuthComplete={() => {}}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /I already have an account/i }));
    expect(
      screen.queryByRole("list", { name: "Password requirements" })
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Back" }));
    fireEvent.click(
      screen.getByRole("button", { name: /Yes, create my free account/i })
    );

    const checklist = screen.getByRole("list", { name: "Password requirements" });
    expect(within(checklist).getByText("At least 8 characters")).toBeInTheDocument();
    expect(
      within(checklist).getByText("One uppercase letter (A-Z)")
    ).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "Abcdefg1!" },
    });

    within(checklist)
      .getAllByRole("listitem")
      .forEach((item) => {
        expect(item.className).toContain("text-green-600");
      });
  });

  it("toggles password visibility on the signup form", () => {
    render(
      <SoftGateModal
        open={true}
        onOpenChange={() => {}}
        onContinueAsGuest={() => {}}
        onAuthComplete={() => {}}
      />
    );

    fireEvent.click(
      screen.getByRole("button", { name: /Yes, create my free account/i })
    );

    const passwordInput = screen.getByLabelText("Password");
    expect(passwordInput).toHaveAttribute("type", "password");
    fireEvent.click(screen.getByRole("button", { name: "Show password" }));
    expect(passwordInput).toHaveAttribute("type", "text");
  });
});
