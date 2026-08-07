import React from "react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MobileJourneyLayout } from "./MobileJourneyLayout";

// --- Keep heavy/unrelated screens out of this test's render tree ---
vi.mock("./JourneyScreen", () => ({
  JourneyScreen: () => <div data-testid="journey-screen" />,
}));
vi.mock("./SummaryScreen", () => ({
  SummaryScreen: () => <div data-testid="summary-screen" />,
}));
vi.mock("./HeaderMobile", () => ({
  HeaderMobile: () => null,
}));
vi.mock("./FooterMobile", () => ({
  FooterMobile: () => null,
}));
vi.mock("@/components/SavedJourneysView", () => ({
  default: () => null,
}));
vi.mock("@/lib/capacitorUtils", () => ({
  isNativeApp: () => false,
  openExternalUrl: vi.fn(),
}));

// --- Store ---
const nextStepMock = vi.fn();
const prevStepMock = vi.fn();
const markSavedMock = vi.fn();
const resetJourneyMock = vi.fn();
const clearLocalProgressMock = vi.fn();

const storeState = {
  currentStep: 2,
  nextStep: nextStepMock,
  prevStep: prevStepMock,
  currentEntry: { responses: { respond: "Some text" } },
  isSaved: false,
  savedJourneyId: null as string | null,
  savedJourneyTitle: null as string | null,
  markSaved: markSavedMock,
  isDirty: false,
  resetJourney: resetJourneyMock,
  clearLocalProgress: clearLocalProgressMock,
};

vi.mock("@/lib/store/useStore", () => ({
  useStore: () => storeState,
}));

// --- journeyApi (real useJourneyAutoSave hook is used, so mock its deps) ---
const saveJourneyMock = vi.fn();
const updateJourneyMock = vi.fn();

vi.mock("@/lib/journeyApi", () => ({
  saveJourney: (...args: unknown[]) => saveJourneyMock(...args),
  updateJourney: (...args: unknown[]) => updateJourneyMock(...args),
}));

// --- Supabase (real AuthModal is used, so mock its client) ---
const getSessionMock = vi.fn();
const onAuthStateChangeMock = vi.fn();
const signUpMock = vi.fn();
const signInWithPasswordMock = vi.fn();
const resetPasswordForEmailMock = vi.fn();
const resendMock = vi.fn();
const signOutMock = vi.fn();

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

/** Minimal fake for `window.visualViewport`, driven manually in tests. */
class FakeVisualViewport extends EventTarget {
  height: number;
  constructor(height: number) {
    super();
    this.height = height;
  }
}

let fakeViewport: FakeVisualViewport;
let authStateCallback: (event: string, session: unknown) => void = () => {};

describe("MobileJourneyLayout — Save button sign-in modal", () => {
  beforeEach(() => {
    nextStepMock.mockReset();
    prevStepMock.mockReset();
    markSavedMock.mockReset();
    resetJourneyMock.mockReset();
    clearLocalProgressMock.mockReset();
    saveJourneyMock.mockReset();
    updateJourneyMock.mockReset();
    getSessionMock.mockReset();
    onAuthStateChangeMock.mockReset();
    signInWithPasswordMock.mockReset();

    storeState.currentStep = 2;
    storeState.isSaved = false;
    storeState.savedJourneyId = null;
    storeState.savedJourneyTitle = null;

    getSessionMock.mockResolvedValue({ data: { session: null } });
    onAuthStateChangeMock.mockImplementation(
      (cb: (event: string, session: unknown) => void) => {
        authStateCallback = cb;
        return { data: { subscription: { unsubscribe: vi.fn() } } };
      }
    );
    signOutMock.mockResolvedValue({ error: null });

    fakeViewport = new FakeVisualViewport(800);
    Object.defineProperty(window, "innerHeight", {
      configurable: true,
      value: 800,
    });
    Object.defineProperty(window, "visualViewport", {
      configurable: true,
      value: fakeViewport,
    });
  });

  it("opens the sign-in modal from the Save button and keeps it open when the on-screen keyboard appears", async () => {
    render(<MobileJourneyLayout session={null} />);

    fireEvent.click(screen.getByText("Save"));

    expect(await screen.findByText("Welcome Back")).toBeInTheDocument();

    // Simulate the mobile keyboard opening — e.g. because the modal's email
    // input auto-focused — by shrinking the visual viewport the same way
    // MobileJourneyLayout's own listener detects it.
    act(() => {
      fakeViewport.height = 500;
      fakeViewport.dispatchEvent(new Event("resize"));
    });

    // The footer is hidden while the keyboard is open (existing, intended
    // behavior) — but the modal itself must remain mounted and open. Before
    // the fix, the modal was a child of the footer and got torn down here.
    expect(screen.queryByLabelText("Next step")).not.toBeInTheDocument();
    expect(screen.getByText("Welcome Back")).toBeInTheDocument();
  });

  it("opens the account modal from the Account button when signed in", async () => {
    const session = { user: { id: "u1", email: "a@example.com" } } as never;
    getSessionMock.mockResolvedValue({ data: { session } });
    render(<MobileJourneyLayout session={session} />);

    fireEvent.click(screen.getByLabelText("Account"));

    expect(await screen.findByText("View Saved Journeys")).toBeInTheDocument();
  });

  it("auto-saves automatically once sign in completes through the Save-triggered modal", async () => {
    saveJourneyMock.mockResolvedValue({ id: "journey-1" });

    render(<MobileJourneyLayout session={null} />);

    fireEvent.click(screen.getByText("Save"));
    expect(await screen.findByText("Welcome Back")).toBeInTheDocument();

    const newSession = { user: { id: "new-user" } };
    await act(async () => {
      authStateCallback("SIGNED_IN", newSession);
    });

    await waitFor(() => {
      expect(saveJourneyMock).toHaveBeenCalledTimes(1);
      expect(markSavedMock).toHaveBeenCalledWith(
        "journey-1",
        expect.stringContaining("Journey")
      );
    });

    // The modal should have closed as part of the normal auth-success flow.
    expect(screen.queryByText("Welcome Back")).not.toBeInTheDocument();
  });
});

describe("MobileJourneyLayout — Journey Complete photo visibility", () => {
  beforeEach(() => {
    storeState.currentStep = 9;
    storeState.isSaved = false;
    storeState.savedJourneyId = null;
    storeState.savedJourneyTitle = null;

    getSessionMock.mockResolvedValue({ data: { session: null } });
    onAuthStateChangeMock.mockImplementation(() => ({
      data: { subscription: { unsubscribe: vi.fn() } },
    }));

    fakeViewport = new FakeVisualViewport(800);
    Object.defineProperty(window, "innerHeight", {
      configurable: true,
      value: 800,
    });
    Object.defineProperty(window, "visualViewport", {
      configurable: true,
      value: fakeViewport,
    });
  });

  it("keeps the summit photo visible through transparent overlays on step 9", () => {
    const { container } = render(<MobileJourneyLayout session={null} />);

    expect(screen.getByTestId("summary-screen")).toBeInTheDocument();

    const scrollSheet = screen.getByTestId("summary-screen").parentElement;
    expect(scrollSheet?.className).toContain("bg-transparent");
    expect(scrollSheet?.className).not.toContain("from-brand-stone");

    const overlays = container.querySelectorAll(".z-5");
    expect(overlays.length).toBe(1);
    expect(overlays[0].className).toContain("bg-transparent");
    expect(overlays[0].className).not.toContain("from-brand-stone/40");
    expect(overlays[0].className).not.toContain("from-brand-slate");

    const bgLayer = container.querySelector(
      "[style*='stage-5-summit.jpg']"
    ) as HTMLElement | null;
    expect(bgLayer).not.toBeNull();
    expect(bgLayer?.style.backgroundImage).toContain("stage-5-summit.jpg");
  });
});
