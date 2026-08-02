import React from "react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import NativeResetPassword from "./NativeResetPassword";

const updateUserMock = vi.fn();

vi.mock("@/lib/supabaseClient", () => ({
  default: {
    auth: {
      updateUser: (...args: unknown[]) => updateUserMock(...args),
    },
  },
}));

describe("NativeResetPassword password requirements checklist and visibility toggle", () => {
  beforeEach(() => {
    updateUserMock.mockReset();
  });

  it("shows a live checklist under the new-password field that updates as it's typed", () => {
    render(<NativeResetPassword onDone={() => {}} />);

    const checklist = screen.getByRole("list", { name: "Password requirements" });
    expect(within(checklist).getByText("One symbol (e.g. !@#$%)")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("New Password"), {
      target: { value: "Abcdefg1!" },
    });

    within(checklist)
      .getAllByRole("listitem")
      .forEach((item) => {
        expect(item.className).toContain("text-green-600");
      });
  });

  it("toggles visibility independently for the new-password and confirm-password fields", () => {
    render(<NativeResetPassword onDone={() => {}} />);

    const newPassword = screen.getByLabelText("New Password");
    const confirmPassword = screen.getByLabelText("Confirm Password");
    const [showNew, showConfirm] = screen.getAllByRole("button", {
      name: "Show password",
    });

    fireEvent.click(showNew);
    expect(newPassword).toHaveAttribute("type", "text");
    expect(confirmPassword).toHaveAttribute("type", "password");

    fireEvent.click(showConfirm);
    expect(confirmPassword).toHaveAttribute("type", "text");
  });

  it("blocks submission with the full policy message when requirements aren't met", async () => {
    render(<NativeResetPassword onDone={() => {}} />);

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
    render(<NativeResetPassword onDone={() => {}} />);

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
