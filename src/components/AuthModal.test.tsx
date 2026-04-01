import React from "react";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Session } from "@supabase/supabase-js";
import AuthModal from "./AuthModal";

const getSessionMock = vi.fn();
const onAuthStateChangeMock = vi.fn();
const signUpMock = vi.fn();
const signInWithPasswordMock = vi.fn();
const resetPasswordForEmailMock = vi.fn();
const resendMock = vi.fn();
const signOutMock = vi.fn();
const clearLocalProgressMock = vi.fn();
const resetJourneyMock = vi.fn();

vi.mock("@/lib/supabaseClient", () => ({
  default: {
    auth: {
      getSession: (...args: unknown[]) => getSessionMock(...args),
      onAuthStateChange: (...args: unknown[]) => onAuthStateChangeMock(...args),
      signUp: (...args: unknown[]) => signUpMock(...args),
      signInWithPassword: (...args: unknown[]) => signInWithPasswordMock(...args),
      resetPasswordForEmail: (...args: unknown[]) =>
        resetPasswordForEmailMock(...args),
      resend: (...args: unknown[]) => resendMock(...args),
      signOut: (...args: unknown[]) => signOutMock(...args),
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
    resetJourney: resetJourneyMock,
    clearLocalProgress: clearLocalProgressMock,
  }),
}));

const authenticatedSession = {
  access_token: "test-access-token",
  user: {
    id: "user-123",
    email: "test@example.com",
    user_metadata: { first_name: "Chris" },
  },
} as unknown as Session;

describe("AuthModal auth parity updates", () => {
  beforeEach(() => {
    getSessionMock.mockReset();
    onAuthStateChangeMock.mockReset();
    signUpMock.mockReset();
    signInWithPasswordMock.mockReset();
    resetPasswordForEmailMock.mockReset();
    resendMock.mockReset();
    signOutMock.mockReset();
    clearLocalProgressMock.mockReset();
    resetJourneyMock.mockReset();

    getSessionMock.mockResolvedValue({ data: { session: null } });
    onAuthStateChangeMock.mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    });
    signOutMock.mockResolvedValue({ error: null });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("applies 8-char validation, duplicate email message mapping, and autocomplete attrs", async () => {
    signUpMock.mockResolvedValue({
      error: { message: "User already registered with this email" },
    });

    render(<AuthModal open={true} onOpenChange={() => {}} session={null} />);

    expect(screen.getByLabelText("Email")).toHaveAttribute(
      "autocomplete",
      "username"
    );
    expect(screen.getByLabelText("Email")).toHaveAttribute("name", "email");
    expect(screen.getByLabelText("Email")).toHaveAttribute(
      "autocapitalize",
      "none"
    );
    expect(screen.getByLabelText("Email")).toHaveAttribute("autocorrect", "off");
    expect(screen.getByLabelText("Password")).toHaveAttribute(
      "autocomplete",
      "current-password"
    );
    expect(screen.getByLabelText("Password")).toHaveAttribute("name", "password");
    expect(screen.getByLabelText("Password")).toHaveAttribute(
      "autocapitalize",
      "none"
    );
    expect(screen.getByLabelText("Password")).toHaveAttribute(
      "autocorrect",
      "off"
    );

    fireEvent.click(screen.getByRole("button", { name: "Sign up" }));

    expect(screen.getByLabelText("First Name")).toHaveAttribute(
      "autocomplete",
      "given-name"
    );
    expect(screen.getByLabelText("First Name")).toHaveAttribute(
      "name",
      "firstName"
    );
    expect(screen.getByLabelText("Email")).toHaveAttribute("autocomplete", "email");
    expect(screen.getByLabelText("Email")).toHaveAttribute("name", "email");
    expect(screen.getByLabelText("Email")).toHaveAttribute(
      "autocapitalize",
      "none"
    );
    expect(screen.getByLabelText("Email")).toHaveAttribute("autocorrect", "off");
    expect(screen.getByLabelText("Password")).toHaveAttribute(
      "placeholder",
      "at least 8 characters."
    );
    expect(screen.getByLabelText("Password")).toHaveAttribute(
      "autocomplete",
      "new-password"
    );
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
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "12345678" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Create Account" }));

    await waitFor(() => {
      expect(
        screen.getByText(
          "This email address is already connected to an account. Please log in or choose Forgot password."
        )
      ).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: "Forgot password?" }));
    expect(screen.getByLabelText("Email")).toHaveAttribute("autocomplete", "email");
    expect(screen.getByLabelText("Email")).toHaveAttribute("name", "email");
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
      await screen.findByText(
        "This email address is already connected to an account. Please log in or choose Forgot password."
      )
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
      await screen.findByText(
        "This email address is already connected to an account. Please log in or choose Forgot password."
      )
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toHaveValue("existing2@example.com");
  });

  it("deletes account after confirmation and clears local state", async () => {
    getSessionMock.mockResolvedValue({ data: { session: authenticatedSession } });
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });
    vi.stubGlobal("fetch", fetchMock);

    render(
      <AuthModal
        open={true}
        onOpenChange={() => {}}
        session={authenticatedSession}
      />
    );

    fireEvent.click(await screen.findByRole("button", { name: "Delete Account" }));
    expect(
      await screen.findByText("Delete Account Permanently")
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Yes, Delete Account" }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        "/api/auth/delete-account",
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            Authorization: "Bearer test-access-token",
          }),
        })
      );
    });

    await waitFor(() => {
      expect(clearLocalProgressMock).toHaveBeenCalled();
      expect(signOutMock).toHaveBeenCalled();
    });

    expect(
      await screen.findByText("Your account has been permanently deleted.")
    ).toBeInTheDocument();
  });

  it("shows account deletion error when API call fails", async () => {
    getSessionMock.mockResolvedValue({ data: { session: authenticatedSession } });
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: "Failed to delete account" }),
    });
    vi.stubGlobal("fetch", fetchMock);

    render(
      <AuthModal
        open={true}
        onOpenChange={() => {}}
        session={authenticatedSession}
      />
    );

    fireEvent.click(await screen.findByRole("button", { name: "Delete Account" }));
    fireEvent.click(screen.getByRole("button", { name: "Yes, Delete Account" }));

    expect(
      await screen.findByText("Failed to delete account")
    ).toBeInTheDocument();
    expect(clearLocalProgressMock).not.toHaveBeenCalled();
  });
});
