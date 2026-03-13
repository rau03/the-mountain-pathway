import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
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
      target: { value: "12345678" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Create Account" }));

    expect(
      await screen.findByText("This email address is already connected to an account.")
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
      target: { value: "12345678" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Create Account" }));

    expect(
      await screen.findByText("This email address is already connected to an account.")
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Welcome Back" })).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toHaveValue("existing2@example.com");
  });
});
