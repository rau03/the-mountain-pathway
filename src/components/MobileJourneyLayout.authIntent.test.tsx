import React from "react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { MobileJourneyLayout } from "./MobileJourneyLayout";

// This file isolates the "which entry point opened the modal" gating logic
// in MobileJourneyLayout from AuthModal's own internal sign-in mechanics
// (covered separately in MobileJourneyLayout.test.tsx and AuthModal.test.tsx).
// AuthModal is replaced with a stub that exposes whatever `onAuthSuccess`
// prop it was given, so we can assert directly: Save wires it up, and every
// other entry point (e.g. Account) does not.

vi.mock("./JourneyScreen", () => ({
  JourneyScreen: () => <div data-testid="journey-screen" />,
}));
vi.mock("./SummaryScreen", () => ({
  SummaryScreen: () => null,
}));
vi.mock("./HeaderMobile", () => ({
  HeaderMobile: () => null,
}));
vi.mock("./FooterMobile", () => ({
  FooterMobile: () => null,
}));

type CapturedAuthModalProps = {
  open: boolean;
  onAuthSuccess?: (session: unknown) => void;
};

let capturedProps: CapturedAuthModalProps | null = null;

vi.mock("./AuthModal", () => ({
  default: (props: CapturedAuthModalProps) => {
    capturedProps = props;
    if (!props.open) return null;
    return (
      <button
        type="button"
        data-testid="simulate-auth-success"
        onClick={() => props.onAuthSuccess?.({ user: { id: "new-user" } })}
      >
        simulate auth success
      </button>
    );
  },
}));

const triggerAutoSaveMock = vi.fn();

vi.mock("@/hooks/useJourneyAutoSave", () => ({
  useJourneyAutoSave: () => ({
    autoSaveLoading: false,
    autoSaveError: null,
    triggerAutoSave: triggerAutoSaveMock,
    handleRetryAutoSave: vi.fn(),
  }),
}));

const storeState = {
  currentStep: 4,
  nextStep: vi.fn(),
  prevStep: vi.fn(),
};

vi.mock("@/lib/store/useStore", () => ({
  useStore: () => storeState,
}));

describe("MobileJourneyLayout — auth modal intent gating", () => {
  beforeEach(() => {
    triggerAutoSaveMock.mockReset();
    capturedProps = null;
    storeState.currentStep = 4;
  });

  it("wires up onAuthSuccess (triggering auto-save) when opened via Save", () => {
    render(<MobileJourneyLayout session={null} />);

    fireEvent.click(screen.getByText("Save"));

    expect(capturedProps?.onAuthSuccess).toBeInstanceOf(Function);

    fireEvent.click(screen.getByTestId("simulate-auth-success"));

    expect(triggerAutoSaveMock).toHaveBeenCalledTimes(1);
    expect(triggerAutoSaveMock).toHaveBeenCalledWith(4, {
      user: { id: "new-user" },
    });
  });

  it("does NOT wire up onAuthSuccess (no auto-save) when opened via Account", () => {
    const session = { user: { id: "existing-user" } } as never;
    render(<MobileJourneyLayout session={session} />);

    fireEvent.click(screen.getByLabelText("Account"));

    expect(capturedProps?.onAuthSuccess).toBeUndefined();

    fireEvent.click(screen.getByTestId("simulate-auth-success"));

    expect(triggerAutoSaveMock).not.toHaveBeenCalled();
  });
});
