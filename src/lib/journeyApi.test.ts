import { beforeEach, describe, expect, it, vi } from "vitest";
import type { SaveJourneyData } from "./journeyApi";
import {
  fetchJourney,
  fetchUserJourneys,
  saveJourney,
} from "./journeyApi";

const supabaseMock = vi.hoisted(() => {
  return {
    auth: {
      getUser: vi.fn(),
    },
    from: vi.fn(),
  };
});

vi.mock("@/lib/supabaseClient", () => ({
  default: supabaseMock,
}));

type BuilderConfig = {
  insertReturnsBuilder?: boolean;
  insertResult?: { error: { message: string } | null };
  updateReturnsBuilder?: boolean;
  selectReturnsBuilder?: boolean;
  singleResult?: { data: unknown; error: { message: string } | null };
  orderResult?: { data: unknown; error: { message: string } | null };
};

function createBuilder(config: BuilderConfig = {}) {
  const builder: Record<string, ReturnType<typeof vi.fn>> = {};

  builder.insert = vi.fn(() => {
    if (config.insertReturnsBuilder) return builder;
    return Promise.resolve(config.insertResult ?? { error: null, data: null });
  });
  builder.update = vi.fn(() => {
    if (config.updateReturnsBuilder) return builder;
    return Promise.resolve({ error: null, data: null });
  });
  builder.delete = vi.fn(() => builder);
  builder.select = vi.fn(() => {
    if (config.selectReturnsBuilder) return builder;
    return Promise.resolve(config.orderResult ?? { data: [], error: null });
  });
  builder.eq = vi.fn(() => builder);
  builder.order = vi.fn(() =>
    Promise.resolve(config.orderResult ?? { data: [], error: null })
  );
  builder.single = vi.fn(() =>
    Promise.resolve(config.singleResult ?? { data: null, error: null })
  );

  return builder;
}

const journeyColumns =
  "id, user_id, title, current_step, is_completed, created_at, updated_at";
const stepColumns =
  "id, journey_id, step_number, step_key, prompt_text, user_response, created_at, updated_at";

describe("journeyApi data flow", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("saveJourney inserts journey metadata with expected payload", async () => {
    const journeysBuilder = createBuilder({
      insertReturnsBuilder: true,
      selectReturnsBuilder: true,
      singleResult: {
        data: {
          id: "journey-1",
          user_id: "user-1",
          title: "Test Title",
          current_step: 3,
          is_completed: false,
          created_at: "2026-03-21T00:00:00Z",
          updated_at: "2026-03-21T00:00:00Z",
        },
        error: null,
      },
    });
    const stepsBuilder = createBuilder({
      insertResult: { error: null },
    });

    supabaseMock.auth.getUser.mockResolvedValue({
      data: { user: { id: "user-1" } },
    });
    supabaseMock.from.mockImplementation((table: string) =>
      table === "journeys" ? journeysBuilder : stepsBuilder
    );

    const payload: SaveJourneyData = {
      title: "Test Title",
      currentStep: 3,
      isCompleted: false,
      currentEntry: {
        id: "entry-1",
        createdAt: "2026-01-01T00:00:00.000Z",
        completed: false,
        responses: { reflect: "Reflect text" },
      },
    };

    await saveJourney(payload);

    expect(supabaseMock.from).toHaveBeenCalledWith("journeys");
    expect(journeysBuilder.insert).toHaveBeenCalledWith({
      user_id: "user-1",
      title: "Test Title",
      current_step: 3,
      is_completed: false,
    });
    expect(journeysBuilder.select).toHaveBeenCalledWith(journeyColumns);
  });

  it("saveJourney inserts only non-empty step responses with correct mapping", async () => {
    const journeysBuilder = createBuilder({
      insertReturnsBuilder: true,
      selectReturnsBuilder: true,
      singleResult: {
        data: {
          id: "journey-2",
          user_id: "user-2",
          title: "Journey",
          current_step: 1,
          is_completed: false,
          created_at: "2026-03-21T00:00:00Z",
          updated_at: "2026-03-21T00:00:00Z",
        },
        error: null,
      },
    });
    const stepsBuilder = createBuilder({
      insertResult: { error: null },
    });

    supabaseMock.auth.getUser.mockResolvedValue({
      data: { user: { id: "user-2" } },
    });
    supabaseMock.from.mockImplementation((table: string) =>
      table === "journeys" ? journeysBuilder : stepsBuilder
    );

    await saveJourney({
      title: "Journey",
      currentStep: 1,
      isCompleted: false,
      currentEntry: {
        id: "entry-2",
        createdAt: "2026-01-01T00:00:00.000Z",
        completed: false,
        responses: {
          reflect: "One",
          respond: "   ",
          prayer: "Two",
        },
      },
    });

    expect(stepsBuilder.insert).toHaveBeenCalledTimes(1);
    expect(stepsBuilder.insert).toHaveBeenCalledWith([
      {
        journey_id: "journey-2",
        step_number: 0,
        step_key: "reflect",
        prompt_text: "What are you reflecting on?",
        user_response: "One",
      },
      {
        journey_id: "journey-2",
        step_number: 1,
        step_key: "prayer",
        prompt_text: "What would you like to pray about?",
        user_response: "Two",
      },
    ]);
  });

  it("saveJourney skips step insert when all responses are empty", async () => {
    const journeysBuilder = createBuilder({
      insertReturnsBuilder: true,
      selectReturnsBuilder: true,
      singleResult: {
        data: {
          id: "journey-3",
          user_id: "user-3",
          title: "Empty",
          current_step: 0,
          is_completed: false,
          created_at: "2026-03-21T00:00:00Z",
          updated_at: "2026-03-21T00:00:00Z",
        },
        error: null,
      },
    });
    const stepsBuilder = createBuilder({
      insertResult: { error: null },
    });

    supabaseMock.auth.getUser.mockResolvedValue({
      data: { user: { id: "user-3" } },
    });
    supabaseMock.from.mockImplementation((table: string) =>
      table === "journeys" ? journeysBuilder : stepsBuilder
    );

    await saveJourney({
      title: "Empty",
      currentStep: 0,
      isCompleted: false,
      currentEntry: {
        id: "entry-3",
        createdAt: "2026-01-01T00:00:00.000Z",
        completed: false,
        responses: { reflect: "  " },
      },
    });

    expect(stepsBuilder.insert).not.toHaveBeenCalled();
  });

  it("fetchUserJourneys queries with explicit columns and user scope", async () => {
    const journeysBuilder = createBuilder({
      selectReturnsBuilder: true,
      orderResult: { data: [{ id: "j-1" }], error: null },
    });

    supabaseMock.auth.getUser.mockResolvedValue({
      data: { user: { id: "user-4" } },
    });
    supabaseMock.from.mockReturnValue(journeysBuilder);

    await fetchUserJourneys();

    expect(supabaseMock.from).toHaveBeenCalledWith("journeys");
    expect(journeysBuilder.select).toHaveBeenCalledWith(journeyColumns);
    expect(journeysBuilder.eq).toHaveBeenCalledWith("user_id", "user-4");
    expect(journeysBuilder.order).toHaveBeenCalledWith("created_at", {
      ascending: false,
    });
  });

  it("fetchJourney loads journey and steps using explicit selects and filters", async () => {
    const journeyBuilder = createBuilder({
      selectReturnsBuilder: true,
      singleResult: {
        data: {
          id: "journey-9",
          user_id: "user-9",
          title: "Saved",
          current_step: 5,
          is_completed: false,
          created_at: "2026-03-21T00:00:00Z",
          updated_at: "2026-03-21T00:00:00Z",
        },
        error: null,
      },
    });
    const stepsBuilder = createBuilder({
      selectReturnsBuilder: true,
      orderResult: {
        data: [
          {
            id: "step-1",
            journey_id: "journey-9",
            step_number: 0,
            step_key: "reflect",
            prompt_text: "What are you reflecting on?",
            user_response: "Response",
            created_at: "2026-03-21T00:00:00Z",
            updated_at: "2026-03-21T00:00:00Z",
          },
        ],
        error: null,
      },
    });

    supabaseMock.auth.getUser.mockResolvedValue({
      data: { user: { id: "user-9" } },
    });
    supabaseMock.from.mockImplementation((table: string) =>
      table === "journeys" ? journeyBuilder : stepsBuilder
    );

    const result = await fetchJourney("journey-9");

    expect(journeyBuilder.select).toHaveBeenCalledWith(journeyColumns);
    expect(journeyBuilder.eq).toHaveBeenNthCalledWith(1, "id", "journey-9");
    expect(journeyBuilder.eq).toHaveBeenNthCalledWith(2, "user_id", "user-9");

    expect(stepsBuilder.select).toHaveBeenCalledWith(stepColumns);
    expect(stepsBuilder.eq).toHaveBeenCalledWith("journey_id", "journey-9");
    expect(stepsBuilder.order).toHaveBeenCalledWith("step_number", {
      ascending: true,
    });

    expect(result).toMatchObject({
      id: "journey-9",
      steps: [{ id: "step-1", step_key: "reflect" }],
    });
  });

  it("saveJourney throws when user is not authenticated", async () => {
    supabaseMock.auth.getUser.mockResolvedValue({
      data: { user: null },
    });

    await expect(
      saveJourney({
        title: "No user",
        currentStep: 0,
        isCompleted: false,
        currentEntry: {
          id: "entry-5",
          createdAt: "2026-01-01T00:00:00.000Z",
          completed: false,
          responses: {},
        },
      })
    ).rejects.toThrow("User must be authenticated to save journeys");
  });
});
