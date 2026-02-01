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
  BookOpen,
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
      <DialogContent className="w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col p-0 gap-0 border-brand-gold/20">
        <DialogHeader className="sr-only">
          <DialogTitle>Your Saved Journeys</DialogTitle>
        </DialogHeader>

        {/* Header */}
        <div className="p-6 pb-4 border-b border-gray-200 dark:border-gray-700">
          <div className="text-center space-y-3">
            <div className="mx-auto w-12 h-12 bg-brand-gold/20 rounded-full flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-brand-gold" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Your Saved Journeys
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Continue where you left off or revisit completed journeys
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-brand-gold" />
              <span className="mt-3 text-gray-600 dark:text-gray-400">
                Loading your journeys...
              </span>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
              <Button
                onClick={loadJourneys}
                variant="outline"
                className="border-gray-300 dark:border-gray-600"
              >
                Try Again
              </Button>
            </div>
          ) : journeys.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <BookOpen className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-700 dark:text-gray-300 font-medium">
                No saved journeys yet
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Complete a journey and save it to see it here.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {journeys.map((journey) => (
                <div
                  key={journey.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:border-brand-gold/30 transition-colors"
                >
                  {/* Title */}
                  <h3 className="font-semibold text-xl mb-4">
                    {journey.title}
                  </h3>

                  {/* Date and Status - stacked on mobile */}
                  <div className="flex flex-col gap-3 mb-6 text-base text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5" />
                      <span>{formatDate(journey.created_at)}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      {journey.is_completed ? (
                        <>
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <span className="text-green-600 font-medium">Completed</span>
                        </>
                      ) : (
                        <>
                          <Clock className="w-5 h-5" />
                          <span>{getProgressText(journey)}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Buttons - full width stacked */}
                  <div className="flex flex-col gap-3">
                    {!journey.is_completed && (
                      <Button
                        size="lg"
                        onClick={() => handleContinue(journey)}
                        disabled={viewLoading === journey.id}
                        className="flex items-center justify-center gap-2 bg-brand-gold hover:bg-brand-gold/90 text-slate-900 w-full h-12"
                      >
                        {viewLoading === journey.id ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <Play className="w-5 h-5" />
                        )}
                        Continue
                      </Button>
                    )}

                    <Button
                      size="lg"
                      variant="outline"
                      onClick={() => handleContinue(journey)}
                      disabled={viewLoading === journey.id}
                      className="flex items-center justify-center gap-2 border-gray-300 dark:border-gray-600 w-full h-12"
                    >
                      {viewLoading === journey.id ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                      View
                    </Button>

                    <Button
                      size="lg"
                      variant="outline"
                      onClick={() => handleDelete(journey.id)}
                      disabled={deleteLoading === journey.id}
                      className="flex items-center justify-center gap-2 text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/20 w-full h-12"
                    >
                      {deleteLoading === journey.id ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Trash2 className="w-5 h-5" />
                      )}
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 p-4 flex justify-end">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-gray-300 dark:border-gray-600"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
