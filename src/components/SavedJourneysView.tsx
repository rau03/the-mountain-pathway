"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Trash2,
  Play,
  Eye,
  Calendar,
  CheckCircle,
  Clock,
  Loader2,
} from "lucide-react";
import {
  fetchUserJourneys,
  fetchJourney,
  deleteJourney,
  type SavedJourney,
} from "@/lib/journeyApi";
import { useStore } from "@/lib/store/useStore";
import { pathwayData } from "@/lib/pathway-data";
import type { JournalEntry } from "@/types";

type SavedJourneysViewProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function SavedJourneysView({
  open,
  onOpenChange,
}: SavedJourneysViewProps) {
  const [journeys, setJourneys] = useState<SavedJourney[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { restoreJourneyEntry } = useStore();
  const [viewLoading, setViewLoading] = useState<string | null>(null);

  // Load journeys when modal opens
  useEffect(() => {
    if (open) {
      loadJourneys();
    }
  }, [open]);

  const loadJourneys = async () => {
    setLoading(true);
    setError(null);

    // Add timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      setLoading(false);
      setError(
        "Loading timed out. Please check your connection and try again."
      );
    }, 15000); // 15 second timeout

    try {
      const userJourneys = await fetchUserJourneys();
      clearTimeout(timeoutId);
      setJourneys(userJourneys);
    } catch (err) {
      clearTimeout(timeoutId);
      setError(err instanceof Error ? err.message : "Failed to load journeys");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this journey? This action cannot be undone."
      )
    ) {
      return;
    }

    setDeleteLoading(id);
    try {
      await deleteJourney(id);
      setJourneys((prev) => prev.filter((j) => j.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete journey");
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleContinue = async (journey: SavedJourney) => {
    setViewLoading(journey.id);
    setError(null);

    try {
      // Fetch the full journey with all steps
      const fullJourney = await fetchJourney(journey.id);

      // Convert journey steps back to responses format
      const responses: JournalEntry["responses"] = {};
      if (fullJourney.steps) {
        fullJourney.steps.forEach((step) => {
          if (step.step_key && step.user_response) {
            responses[step.step_key as keyof JournalEntry["responses"]] =
              step.user_response;
          }
        });
      }

      // Create a JournalEntry from the saved journey
      const restoredEntry: JournalEntry = {
        id: journey.id,
        createdAt: journey.created_at,
        responses,
        completed: journey.is_completed,
      };

      // Restore the journey entry to the store (including title for updates)
      restoreJourneyEntry(
        restoredEntry,
        journey.current_step,
        journey.id,
        journey.title
      );

      // Close the modal
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load journey");
    } finally {
      setViewLoading(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getProgressText = (journey: SavedJourney) => {
    if (journey.is_completed) {
      return "Completed";
    }
    const stepNumber =
      journey.current_step === 9
        ? pathwayData.length
        : journey.current_step + 1;
    return `Step ${stepNumber} of ${pathwayData.length}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Your Saved Journeys</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="ml-2">Loading journeys...</span>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
              <Button onClick={loadJourneys} variant="outline">
                Try Again
              </Button>
            </div>
          ) : journeys.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No saved journeys yet.</p>
              <p className="text-sm mt-2">
                Complete a journey and save it to see it here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {journeys.map((journey) => (
                <div
                  key={journey.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-lg truncate">
                        {journey.title}
                      </h3>

                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(journey.created_at)}
                        </div>

                        <div className="flex items-center gap-1">
                          {journey.is_completed ? (
                            <>
                              <CheckCircle className="w-4 h-4 text-green-600" />
                              <span className="text-green-600">Completed</span>
                            </>
                          ) : (
                            <>
                              <Clock className="w-4 h-4" />
                              <span>{getProgressText(journey)}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      {!journey.is_completed && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleContinue(journey)}
                          disabled={viewLoading === journey.id}
                          className="flex items-center gap-1"
                        >
                          {viewLoading === journey.id ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Play className="w-3 h-3" />
                          )}
                          Continue
                        </Button>
                      )}

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleContinue(journey)}
                        disabled={viewLoading === journey.id}
                        className="flex items-center gap-1"
                      >
                        {viewLoading === journey.id ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Eye className="w-3 h-3" />
                        )}
                        View
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(journey.id)}
                        disabled={deleteLoading === journey.id}
                        className="flex items-center gap-1 text-red-600 hover:text-red-700"
                      >
                        {deleteLoading === journey.id ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Trash2 className="w-3 h-3" />
                        )}
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t pt-4 flex justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
