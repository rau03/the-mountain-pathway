import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { MobileSaveFooter } from "./MobileSaveFooter";

const nextStepMock = vi.fn();
const prevStepMock = vi.fn();

const storeState = {
  currentStep: 2,
  nextStep: nextStepMock,
  prevStep: prevStepMock,
};

vi.mock("@/lib/store/useStore", () => ({
  useStore: () => storeState,
}));

vi.mock("@/lib/capacitorUtils", () => ({
  openExternalUrl: vi.fn(),
}));

const noop = () => {};

describe("MobileSaveFooter", () => {
  beforeEach(() => {
    nextStepMock.mockReset();
    prevStepMock.mockReset();
    storeState.currentStep = 2;
  });

  it("shows Save (not Account) when signed out, and calls onSaveClick", () => {
    const onSaveClick = vi.fn();
    render(
      <MobileSaveFooter
        session={null}
        onSaveClick={onSaveClick}
        onAccountClick={noop}
        autoSaveLoading={false}
        autoSaveError={null}
        onRetryAutoSave={noop}
        onNextStepSave={noop}
      />
    );

    expect(screen.queryByLabelText("Account")).not.toBeInTheDocument();
    fireEvent.click(screen.getByText("Save"));
    expect(onSaveClick).toHaveBeenCalledTimes(1);
  });

  it("shows Account (not Save) when signed in, and calls onAccountClick", () => {
    const onAccountClick = vi.fn();
    const session = { user: { id: "u1" } } as never;
    render(
      <MobileSaveFooter
        session={session}
        onSaveClick={noop}
        onAccountClick={onAccountClick}
        autoSaveLoading={false}
        autoSaveError={null}
        onRetryAutoSave={noop}
        onNextStepSave={noop}
      />
    );

    expect(screen.queryByText("Save")).not.toBeInTheDocument();
    fireEvent.click(screen.getByLabelText("Account"));
    expect(onAccountClick).toHaveBeenCalledTimes(1);
  });

  it("advances the step and requests an auto-save for the target step", () => {
    const onNextStepSave = vi.fn();
    render(
      <MobileSaveFooter
        session={null}
        onSaveClick={noop}
        onAccountClick={noop}
        autoSaveLoading={false}
        autoSaveError={null}
        onRetryAutoSave={noop}
        onNextStepSave={onNextStepSave}
      />
    );

    fireEvent.click(screen.getByLabelText("Next step"));

    expect(nextStepMock).toHaveBeenCalledTimes(1);
    expect(onNextStepSave).toHaveBeenCalledWith(3);
  });

  it("does not request an auto-save when completing the journey from the last step", () => {
    storeState.currentStep = 9;
    const onNextStepSave = vi.fn();
    render(
      <MobileSaveFooter
        session={null}
        onSaveClick={noop}
        onAccountClick={noop}
        autoSaveLoading={false}
        autoSaveError={null}
        onRetryAutoSave={noop}
        onNextStepSave={onNextStepSave}
      />
    );

    fireEvent.click(screen.getByLabelText("Next step"));

    expect(nextStepMock).toHaveBeenCalledTimes(1);
    expect(onNextStepSave).not.toHaveBeenCalled();
  });

  it("disables the Next button while an auto-save is in flight", () => {
    render(
      <MobileSaveFooter
        session={null}
        onSaveClick={noop}
        onAccountClick={noop}
        autoSaveLoading={true}
        autoSaveError={null}
        onRetryAutoSave={noop}
        onNextStepSave={noop}
      />
    );

    expect(screen.getByLabelText("Next step")).toBeDisabled();
  });

  it("shows a retry banner on auto-save error and calls onRetryAutoSave when tapped", () => {
    const onRetryAutoSave = vi.fn();
    render(
      <MobileSaveFooter
        session={null}
        onSaveClick={noop}
        onAccountClick={noop}
        autoSaveLoading={false}
        autoSaveError="Not saved - tap to retry"
        onRetryAutoSave={onRetryAutoSave}
        onNextStepSave={noop}
      />
    );

    const retryButton = screen.getByText("Not saved - tap to retry");
    fireEvent.click(retryButton);
    expect(onRetryAutoSave).toHaveBeenCalledTimes(1);
  });
});
