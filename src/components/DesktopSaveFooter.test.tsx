import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { DesktopSaveFooter } from "./DesktopSaveFooter";

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

describe("DesktopSaveFooter", () => {
  beforeEach(() => {
    nextStepMock.mockReset();
    prevStepMock.mockReset();
    storeState.currentStep = 2;
  });

  it("shows Save when signed out and calls onSaveClick", () => {
    const onSaveClick = vi.fn();
    render(
      <DesktopSaveFooter
        session={null}
        onSaveClick={onSaveClick}
        autoSaveLoading={false}
        autoSaveError={null}
        onRetryAutoSave={noop}
        onNextStepSave={noop}
      />
    );

    fireEvent.click(screen.getByText("Save"));
    expect(onSaveClick).toHaveBeenCalledTimes(1);
  });

  it("hides Save when signed in", () => {
    const session = { user: { id: "u1" } } as never;
    render(
      <DesktopSaveFooter
        session={session}
        onSaveClick={noop}
        autoSaveLoading={false}
        autoSaveError={null}
        onRetryAutoSave={noop}
        onNextStepSave={noop}
      />
    );

    expect(screen.queryByText("Save")).not.toBeInTheDocument();
  });

  it("advances the step and requests an auto-save for the target step", () => {
    const onNextStepSave = vi.fn();
    render(
      <DesktopSaveFooter
        session={null}
        onSaveClick={noop}
        autoSaveLoading={false}
        autoSaveError={null}
        onRetryAutoSave={noop}
        onNextStepSave={onNextStepSave}
      />
    );

    const nextButton = screen.getAllByRole("button").at(-1)!;
    fireEvent.click(nextButton);

    expect(nextStepMock).toHaveBeenCalledTimes(1);
    expect(onNextStepSave).toHaveBeenCalledWith(3);
  });

  it("shows a retry banner on auto-save error and calls onRetryAutoSave when tapped", () => {
    const onRetryAutoSave = vi.fn();
    render(
      <DesktopSaveFooter
        session={null}
        onSaveClick={noop}
        autoSaveLoading={false}
        autoSaveError="Not saved - tap to retry"
        onRetryAutoSave={onRetryAutoSave}
        onNextStepSave={noop}
      />
    );

    fireEvent.click(screen.getByText("Not saved - tap to retry"));
    expect(onRetryAutoSave).toHaveBeenCalledTimes(1);
  });
});
