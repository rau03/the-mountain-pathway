import React from "react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import ResetPasswordPage from "./page";

const getSessionMock = vi.fn();
const updateUserMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock("@/lib/supabaseClient", () => ({
  default: {
    auth: {
      getSession: (...args: unknown[]) => getSessionMock(...args),
      updateUser: (...args: unknown[]) => updateUserMock(...args),
    },
  },
}));

describe("ResetPasswordPage password requirements checklist and visibility toggle", () => {
  beforeEach(() => {
    getSessionMock.mockReset();
    updateUserMock.mockReset();
    getSessionMock.mockResolvedValue({
      data: { session: { access_token: "token" } },
    });
  });

  it("shows a live checklist under the new-password field only, updating as it's typed", async () => {
    render(<ResetPasswordPage />);

    await screen.findByText("Set New Password");

    const checklist = screen.getByRole("list", { name: "Password requirements" });
    expect(within(checklist).getByText("At least 8 characters")).toBeInTheDocument();

    const newPassword = screen.getByLabelText("New Password");
    const confirmPassword = screen.getByLabelText("Confirm Password");

    fireEvent.change(newPassword, { target: { value: "Abcdefg1!" } });
    within(checklist)
      .getAllByRole("listitem")
      .forEach((item) => {
        expect(item.className).toContain("text-green-600");
      });

    // Confirm-password field should not render its own checklist.
    expect(
      screen.getAllByRole("list", { name: "Password requirements" })
    ).toHaveLength(1);
    expect(confirmPassword).toBeInTheDocument();
  });

  it("toggles visibility independently for the new-password and confirm-password fields", async () => {
    render(<ResetPasswordPage />);
    await screen.findByText("Set New Password");

    const newPassword = screen.getByLabelText("New Password");
    const confirmPassword = screen.getByLabelText("Confirm Password");
    const [showNew, showConfirm] = screen.getAllByRole("button", {
      name: "Show password",
    });

    expect(newPassword).toHaveAttribute("type", "password");
    expect(confirmPassword).toHaveAttribute("type", "password");

    fireEvent.click(showNew);
    expect(newPassword).toHaveAttribute("type", "text");
    expect(confirmPassword).toHaveAttribute("type", "password");

    fireEvent.click(showConfirm);
    expect(confirmPassword).toHaveAttribute("type", "text");
  });

  it("blocks submission with the full policy message when the password doesn't meet every requirement", async () => {
    render(<ResetPasswordPage />);
    await screen.findByText("Set New Password");

    fireEvent.change(screen.getByLabelText("New Password"), {
      target: { value: "lowercase1" },
    });
    fireEvent.change(screen.getByLabelText("Confirm Password"), {
      target: { value: "lowercase1" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Update Password" }));

    expect(
      await screen.findByText(
        "Password must be at least 8 characters and include an uppercase letter, a lowercase letter, a number, and a symbol."
      )
    ).toBeInTheDocument();
    expect(updateUserMock).not.toHaveBeenCalled();
  });

  it("submits successfully once the password satisfies the full policy and matches confirmation", async () => {
    updateUserMock.mockResolvedValue({ error: null });
    render(<ResetPasswordPage />);
    await screen.findByText("Set New Password");

    fireEvent.change(screen.getByLabelText("New Password"), {
      target: { value: "Abcdefg1!" },
    });
    fireEvent.change(screen.getByLabelText("Confirm Password"), {
      target: { value: "Abcdefg1!" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Update Password" }));

    await waitFor(() => {
      expect(updateUserMock).toHaveBeenCalledWith({ password: "Abcdefg1!" });
    });
  });
});
