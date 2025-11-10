import { createClient } from "@supabase/supabase-js";
import type { JournalEntry } from "@/types";

// Create Supabase client for API calls
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export interface SavedJourney {
  id: string;
  user_id: string;
  title: string;
  current_step: number;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
  // Steps will be loaded separately from journey_steps table
  steps?: SavedJourneyStep[];
}

export interface SavedJourneyStep {
  id: string;
  journey_id: string;
  step_number: number;
  step_key: string;
  prompt_text: string;
  user_response: string;
  created_at: string;
  updated_at: string;
}

export interface SaveJourneyData {
  title: string;
  currentEntry: JournalEntry;
  currentStep: number;
  isCompleted: boolean;
}

/**
 * Helper function to get prompt text for a step key
 */
function getPromptForStepKey(stepKey: string): string {
  const prompts: Record<string, string> = {
    reflect: "What are you reflecting on?",
    respond: "How do you respond to this situation?",
    thoughts: "What thoughts come to mind?",
    emotions: "What emotions are you experiencing?",
    desire: "What do you desire in this moment?",
    pause: "Take a moment to pause and breathe",
    choices: "What choices do you have?",
    prayer: "What would you like to pray about?",
  };
  return prompts[stepKey] || `Step: ${stepKey}`;
}

/**
 * Save a new journey to the database (two-table design)
 */
export async function saveJourney(
  data: SaveJourneyData
): Promise<SavedJourney> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User must be authenticated to save journeys");
  }

  // Save journey metadata to journeys table
  const { data: savedJourney, error: journeyError } = await supabase
    .from("journeys")
    .insert({
      user_id: user.id,
      title: data.title,
      current_step: data.currentStep,
      is_completed: data.isCompleted,
    })
    .select()
    .single();

  if (journeyError) {
    console.error("Error saving journey:", journeyError);
    throw new Error(`Failed to save journey: ${journeyError.message}`);
  }

  // Save individual steps to journey_steps table
  const stepsToInsert = Object.entries(data.currentEntry.responses)
    .filter(([, response]) => response && response.trim())
    .map(([stepKey, response], index) => ({
      journey_id: savedJourney.id,
      step_number: index,
      step_key: stepKey,
      prompt_text: getPromptForStepKey(stepKey),
      user_response: response,
    }));

  if (stepsToInsert.length > 0) {
    const { error: stepsError } = await supabase
      .from("journey_steps")
      .insert(stepsToInsert);

    if (stepsError) {
      console.error("Error saving journey steps:", stepsError);
      // Clean up the journey if steps failed to save
      await supabase.from("journeys").delete().eq("id", savedJourney.id);
      throw new Error(`Failed to save journey steps: ${stepsError.message}`);
    }
  }

  return savedJourney;
}

/**
 * Update an existing journey (two-table design)
 */
export async function updateJourney(
  id: string,
  data: Partial<SaveJourneyData>
): Promise<SavedJourney> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User must be authenticated to update journeys");
  }

  // Update journey metadata
  const updateData: Record<string, unknown> = {};
  if (data.title) updateData.title = data.title;
  if (data.currentStep !== undefined)
    updateData.current_step = data.currentStep;
  if (data.isCompleted !== undefined)
    updateData.is_completed = data.isCompleted;

  const { data: updatedJourney, error: journeyError } = await supabase
    .from("journeys")
    .update(updateData)
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (journeyError) {
    console.error("Error updating journey:", journeyError);
    throw new Error(`Failed to update journey: ${journeyError.message}`);
  }

  // Update steps if currentEntry is provided
  if (data.currentEntry) {
    // Delete existing steps for this journey
    await supabase.from("journey_steps").delete().eq("journey_id", id);

    // Insert updated steps
    const stepsToInsert = Object.entries(data.currentEntry.responses)
      .filter(([, response]) => response && response.trim())
      .map(([stepKey, response], index) => ({
        journey_id: id,
        step_number: index,
        step_key: stepKey,
        prompt_text: getPromptForStepKey(stepKey),
        user_response: response,
      }));

    if (stepsToInsert.length > 0) {
      const { error: stepsError } = await supabase
        .from("journey_steps")
        .insert(stepsToInsert);

      if (stepsError) {
        console.error("Error updating journey steps:", stepsError);
        throw new Error(
          `Failed to update journey steps: ${stepsError.message}`
        );
      }
    }
  }

  return updatedJourney;
}

/**
 * Fetch all user's saved journeys
 */
export async function fetchUserJourneys(): Promise<SavedJourney[]> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User must be authenticated to fetch journeys");
  }

  const { data: journeys, error } = await supabase
    .from("journeys")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching journeys:", error);
    throw new Error(`Failed to fetch journeys: ${error.message}`);
  }

  return journeys || [];
}

/**
 * Fetch a specific journey by ID with its steps
 */
export async function fetchJourney(id: string): Promise<SavedJourney> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User must be authenticated to fetch journey");
  }

  // Fetch journey metadata
  const { data: journey, error: journeyError } = await supabase
    .from("journeys")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (journeyError) {
    console.error("Error fetching journey:", journeyError);
    throw new Error(`Failed to fetch journey: ${journeyError.message}`);
  }

  // Fetch journey steps
  const { data: steps, error: stepsError } = await supabase
    .from("journey_steps")
    .select("*")
    .eq("journey_id", id)
    .order("step_number", { ascending: true });

  if (stepsError) {
    console.error("Error fetching journey steps:", stepsError);
    throw new Error(`Failed to fetch journey steps: ${stepsError.message}`);
  }

  return {
    ...journey,
    steps: steps || [],
  };
}

/**
 * Delete a saved journey and all its steps
 */
export async function deleteJourney(id: string): Promise<void> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User must be authenticated to delete journeys");
  }

  // Delete the journey (CASCADE will automatically delete related steps)
  const { error } = await supabase
    .from("journeys")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error deleting journey:", error);
    throw new Error(`Failed to delete journey: ${error.message}`);
  }
}

/**
 * Check if user has any saved journeys
 */
export async function hasUserJourneys(): Promise<boolean> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return false;

  const { count, error } = await supabase
    .from("journeys")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  if (error) {
    console.error("Error checking user journeys:", error);
    return false;
  }

  return (count || 0) > 0;
}
