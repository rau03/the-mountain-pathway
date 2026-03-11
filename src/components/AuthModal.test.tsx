import React from "react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import AuthModal from "./AuthModal";

const signUpMock = vi.fn();
const signInWithPasswordMock = vi.fn();
const resetPasswordForEmailMock = vi.fn();
const resendMock = vi.fn();

vi.mock("@/lib/supabaseClient", () => ({
  default: {
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
      onAuthStateChange: vi.fn().mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } },
      }),
      signUp: (...args: unknown[]) => signUpMock(...args),
      signInWithPassword: (...args: unknown[]) => signInWithPasswordMock(...args),
      resetPasswordForEmail: (...args: unknown[]) =>
        resetPasswordForEmailMock(...args),
      resend: (...args: unknown[]) => resendMock(...args),
    },
  },
}));

vi.mock("@/components/SavedJourneysView", () => ({
  default: () => null,
}));

vi.mock("@/lib/store/useStore", () => ({
  useStore: () => ({
    isDirty: false,
    currentStep: -1,
    isSaved: false,
    resetJourney: vi.fn(),
  }),
}));

describe("AuthModal auth parity updates", () => {
  beforeEach(() => {
    signUpMock.mockReset();
    signInWithPasswordMock.mockReset();
    resetPasswordForEmailMock.mockReset();
    resendMock.mockReset();
  });

  it("applies 8-char validation, duplicate email message mapping, and autocomplete attrs", async () => {
    signUpMock.mockResolvedValue({
      error: { message: "User already registered with this email" },
    });

    render(<AuthModal open={true} onOpenChange={() => {}} session={null} />);

    expect(screen.getByLabelText("Email")).toHaveAttribute("autocomplete", "email");
    expect(screen.getByLabelText("Password")).toHaveAttribute(
      "autocomplete",
      "current-password"
    );

    fireEvent.click(screen.getByRole("button", { name: "Sign up" }));

    expect(screen.getByLabelText("First Name")).toHaveAttribute(
      "autocomplete",
      "given-name"
    );
    expect(screen.getByLabelText("Email")).toHaveAttribute("autocomplete", "email");
    expect(screen.getByLabelText("Password")).toHaveAttribute(
      "placeholder",
      "at least 8 characters."
    );
    expect(screen.getByLabelText("Password")).toHaveAttribute(
      "autocomplete",
      "new-password"
    );

    fireEvent.change(screen.getByLabelText("First Name"), {
      target: { value: "Chris" },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "12345678" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Create Account" }));

    await waitFor(() => {
      expect(
        screen.getByText("This email address is already connected to an account.")
      ).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: "Forgot password?" }));
    expect(screen.getByLabelText("Email")).toHaveAttribute("autocomplete", "email");
  });

  it("enforces 8-character minimum for signup", async () => {
    render(<AuthModal open={true} onOpenChange={() => {}} session={null} />);
    fireEvent.click(screen.getByRole("button", { name: "Sign up" }));

    fireEvent.change(screen.getByLabelText("First Name"), {
      target: { value: "Chris" },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "short@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "1234567" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Create Account" }));

    expect(
      await screen.findByText("Password must be at least 8 characters")
    ).toBeInTheDocument();
    expect(signUpMock).not.toHaveBeenCalled();
  });

  it("handles existing-account signup responses with no explicit error", async () => {
    signUpMock.mockResolvedValue({
      data: { user: { identities: [] } },
      error: null,
    });

    render(<AuthModal open={true} onOpenChange={() => {}} session={null} />);
    fireEvent.click(screen.getByRole("button", { name: "Sign up" }));
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
    expect(screen.getByRole("button", { name: "Log In" })).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toHaveValue("existing@example.com");
    expect(screen.getByLabelText("Password")).toHaveValue("");
  });

  it("maps duplicate email using Supabase error code variants", async () => {
    signUpMock.mockResolvedValue({
      data: { user: null },
      error: {
        message: "Please use a different credential",
        code: "user_already_exists",
      },
    });

    render(<AuthModal open={true} onOpenChange={() => {}} session={null} />);
    fireEvent.click(screen.getByRole("button", { name: "Sign up" }));
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
    expect(screen.getByLabelText("Email")).toHaveValue("existing2@example.com");
  });
});
