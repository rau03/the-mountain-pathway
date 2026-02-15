import React from "react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import SavedJourneysView from "./SavedJourneysView";

const restoreJourneyEntryMock = vi.fn();

vi.mock("@/lib/store/useStore", () => ({
  useStore: () => ({
    restoreJourneyEntry: restoreJourneyEntryMock,
  }),
}));

const fetchUserJourneysMock = vi.fn();
const fetchJourneyMock = vi.fn();
const deleteJourneyMock = vi.fn();

vi.mock("@/lib/journeyApi", () => ({
  fetchUserJourneys: (...args: unknown[]) => fetchUserJourneysMock(...args),
  fetchJourney: (...args: unknown[]) => fetchJourneyMock(...args),
  deleteJourney: (...args: unknown[]) => deleteJourneyMock(...args),
}));

describe("SavedJourneysView button behavior", () => {
  beforeEach(() => {
    restoreJourneyEntryMock.mockReset();
    fetchUserJourneysMock.mockReset();
    fetchJourneyMock.mockReset();
    deleteJourneyMock.mockReset();
  });

  it("incomplete journey: Continue restores to current_step; View restores to step 0", async () => {
    fetchUserJourneysMock.mockResolvedValueOnce([
      {
        id: "j1",
        user_id: "u1",
        title: "Journey 1",
        current_step: 4,
        is_completed: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]);

    fetchJourneyMock.mockResolvedValue({
      id: "j1",
      user_id: "u1",
      title: "Journey 1",
      current_step: 4,
      is_completed: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      steps: [
        {
          id: "s1",
          journey_id: "j1",
          step_number: 0,
          step_key: "reflect",
          prompt_text: "p",
          user_response: "r",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ],
    });

    render(<SavedJourneysView open={true} onOpenChange={() => {}} />);

    // Wait for journey card
    expect(await screen.findByText("Journey 1")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /continue/i }));
    // restoreJourneyEntry(entry, step, id, title)
    await vi.waitFor(() => {
      expect(restoreJourneyEntryMock).toHaveBeenCalled();
      expect(restoreJourneyEntryMock.mock.calls.at(-1)?.[1]).toBe(4);
    });

    fireEvent.click(screen.getByRole("button", { name: /view/i }));
    await vi.waitFor(() => {
      expect(restoreJourneyEntryMock).toHaveBeenCalled();
      expect(restoreJourneyEntryMock.mock.calls.at(-1)?.[1]).toBe(0);
    });
  });

  it("completed journey: View restores to step 9 (Journey Complete)", async () => {
    fetchUserJourneysMock.mockResolvedValueOnce([
      {
        id: "j2",
        user_id: "u1",
        title: "Journey 2",
        current_step: 9,
        is_completed: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]);

    fetchJourneyMock.mockResolvedValue({
      id: "j2",
      user_id: "u1",
      title: "Journey 2",
      current_step: 9,
      is_completed: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      steps: [],
    });

    render(<SavedJourneysView open={true} onOpenChange={() => {}} />);
    expect(await screen.findByText("Journey 2")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /view/i }));
    await vi.waitFor(() => {
      expect(restoreJourneyEntryMock).toHaveBeenCalled();
      expect(restoreJourneyEntryMock.mock.calls.at(-1)?.[1]).toBe(9);
    });
  });
});

