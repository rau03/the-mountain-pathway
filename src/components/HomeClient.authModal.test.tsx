import React from "react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import HomeClient from "./HomeClient";

// Desktop-only entry points unrelated to this test.
vi.mock("@/components/DesktopAuthSection", () => ({
  DesktopAuthSection: () => null,
}));
// Mobile layout is out of scope here (covered by MobileJourneyLayout tests).
vi.mock("@/components/MobileJourneyLayout", () => ({
  MobileJourneyLayout: () => null,
}));
vi.mock("@/components/JourneyScreen", () => ({
  JourneyScreen: () => <div data-testid="journey-screen" />,
}));
vi.mock("@/components/SummaryScreen", () => ({
  SummaryScreen: () => null,
}));
vi.mock("@/components/SoftGateModal", () => ({
  default: () => null,
}));
vi.mock("@/components/WelcomeInfoModal", () => ({
  default: () => null,
}));
vi.mock("@/components/ProfileSetupModal", () => ({
  default: () => null,
}));
vi.mock("@/components/NativeResetPassword", () => ({
  default: () => null,
}));

type CapturedAuthModalProps = {
  open: boolean;
  onAuthSuccess?: (session: unknown) => void;
};

let capturedProps: CapturedAuthModalProps | null = null;

vi.mock("@/components/AuthModal", () => ({
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

vi.mock("@/hooks/useNativeAuthDeepLink", () => ({
  useNativeAuthDeepLink: () => ({
    showNativeResetPassword: false,
    setShowNativeResetPassword: vi.fn(),
  }),
}));
vi.mock("@/hooks/useJourneyBackground", () => ({
  useJourneyBackground: () => ({
    currentBackground: "/homepage-background.v3.jpg",
    desktopAlignment: "[background-position:center_50%]",
  }),
}));
let isMobileFlag = false;
vi.mock("@/hooks/useViewportFlags", () => ({
  useViewportFlags: () => ({ isMobile: isMobileFlag }),
}));
vi.mock("@/hooks/useDesktopStepScrollReset", () => ({
  useDesktopStepScrollReset: () => {},
}));
vi.mock("@/hooks/useUnsavedJourneyUnloadGuard", () => ({
  useUnsavedJourneyUnloadGuard: () => {},
}));

let liveSession: unknown = null;
vi.mock("@/hooks/useHomeSessionSync", () => ({
  useHomeSessionSync: () => ({
    liveSession,
    showProfileSetupModal: false,
    setShowProfileSetupModal: vi.fn(),
  }),
}));

const storeState = {
  currentStep: 2,
  setCurrentStep: vi.fn(),
  setAnonymous: vi.fn(),
  startJourney: vi.fn(),
  nextStep: vi.fn(),
  prevStep: vi.fn(),
};

vi.mock("@/lib/store/useStore", () => ({
  useStore: () => storeState,
}));

describe("HomeClient — shared auth modal (desktop Save footer)", () => {
  beforeEach(() => {
    triggerAutoSaveMock.mockReset();
    capturedProps = null;
    storeState.currentStep = 2;
    liveSession = null;
    isMobileFlag = false;
  });

  it("wires up onAuthSuccess (triggering auto-save) when opened via the desktop footer's Save button", async () => {
    render(<HomeClient session={null} />);

    fireEvent.click(await screen.findByText("Save"));

    // The AuthModal itself is lazy-loaded via next/dynamic; wait for the
    // (mocked) modal to mount in its open state before asserting on props.
    fireEvent.click(await screen.findByTestId("simulate-auth-success"));

    expect(capturedProps?.onAuthSuccess).toBeInstanceOf(Function);
    expect(triggerAutoSaveMock).toHaveBeenCalledTimes(1);
    expect(triggerAutoSaveMock).toHaveBeenCalledWith(2, {
      user: { id: "new-user" },
    });
  });

  it("does NOT wire up onAuthSuccess (no auto-save) when opened via the mobile-landing Account button", async () => {
    liveSession = { user: { id: "existing-user" } };
    storeState.currentStep = -1; // Landing page
    isMobileFlag = true;
    render(<HomeClient session={liveSession as never} />);

    fireEvent.click(await screen.findByLabelText("Account"));

    fireEvent.click(await screen.findByTestId("simulate-auth-success"));

    expect(capturedProps?.onAuthSuccess).toBeUndefined();
    expect(triggerAutoSaveMock).not.toHaveBeenCalled();
  });
});
