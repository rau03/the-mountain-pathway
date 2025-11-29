"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type SaveJourneyModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (title: string) => Promise<void>;
  initialTitle?: string;
  isUpdate?: boolean;
  isLoading?: boolean;
};

export default function SaveJourneyModal({
  open,
  onOpenChange,
  onSave,
  initialTitle = "",
  isUpdate = false,
  isLoading = false,
}: SaveJourneyModalProps) {
  const [title, setTitle] = useState(initialTitle);
  const [error, setError] = useState<string | null>(null);
  const [internalLoading, setInternalLoading] = useState(false);

  // Reset title when modal opens or initialTitle changes
  useEffect(() => {
    if (open) {
      setTitle(initialTitle);
      setError(null);
      setInternalLoading(false);
    }
  }, [open, initialTitle]);

  // Sync internal loading with prop
  useEffect(() => {
    setInternalLoading(isLoading);
  }, [isLoading]);

  const handleSave = async () => {
    if (!title.trim()) {
      setError("Please enter a title for your journey");
      return;
    }

    if (title.trim().length < 3) {
      setError("Title must be at least 3 characters long");
      return;
    }

    if (title.trim().length > 100) {
      setError("Title must be less than 100 characters");
      return;
    }

    setInternalLoading(true);
    setError(null);

    try {
      await onSave(title.trim());
      // Only close and reset if save was successful
      setTitle("");
      setError(null);
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save journey");
    } finally {
      setInternalLoading(false);
    }
  };

  const handleCancel = () => {
    setTitle(initialTitle);
    setError(null);
    setInternalLoading(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isUpdate ? "Update Journey" : "Save Journey"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="journey-title"
              className="block text-sm font-medium mb-2"
            >
              Journey Title
            </label>
            <input
              id="journey-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a name for your journey..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              maxLength={100}
              disabled={internalLoading || isLoading}
              autoFocus
              onKeyDown={(e) => {
                if (
                  e.key === "Enter" &&
                  !internalLoading &&
                  !isLoading &&
                  title.trim()
                ) {
                  handleSave();
                }
              }}
            />
            <div className="text-xs text-gray-500 mt-1">
              {title.length}/100 characters
            </div>
          </div>

          {error && (
            <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-2 rounded">
              {error}
            </div>
          )}

          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={internalLoading || isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={internalLoading || isLoading || !title.trim()}
              className="min-w-[80px]"
            >
              {internalLoading || isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Saving...
                </div>
              ) : isUpdate ? (
                "Update"
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
