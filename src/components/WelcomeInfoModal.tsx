"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mountain, Clock, Heart, BookOpen, Sparkles } from "lucide-react";

type WelcomeInfoModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function WelcomeInfoModal({
  open,
  onOpenChange,
}: WelcomeInfoModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md sm:max-w-lg p-0 gap-0 overflow-hidden border-brand-gold/20">
        <DialogHeader className="sr-only">
          <DialogTitle>About The Mountain Pathway</DialogTitle>
        </DialogHeader>

        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="mx-auto w-14 h-14 bg-brand-gold/20 rounded-full flex items-center justify-center">
              <Mountain className="w-7 h-7 text-brand-gold" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Who is this for?
            </h2>
          </div>

          {/* Content */}
          <div className="space-y-4 text-gray-600 dark:text-gray-300">
            <p className="text-center leading-relaxed">
              The Mountain Pathway is a guided reflection experience designed
              for anyone seeking a moment of peace and self-discovery in their
              day.
            </p>

            {/* Features */}
            <div className="grid gap-3">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                <div className="p-2 bg-brand-gold/10 rounded-full flex-shrink-0">
                  <Heart className="w-4 h-4 text-brand-gold" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white text-sm">
                    For Those Seeking Stillness
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Take a mindful pause from the busyness of daily life
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                <div className="p-2 bg-brand-gold/10 rounded-full flex-shrink-0">
                  <BookOpen className="w-4 h-4 text-brand-gold" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white text-sm">
                    For Reflective Journaling
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Guided prompts help you explore your thoughts and feelings
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                <div className="p-2 bg-brand-gold/10 rounded-full flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-brand-gold" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white text-sm">
                    For Spiritual Growth
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Connect with timeless wisdom through scripture and
                    meditation
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                <div className="p-2 bg-brand-gold/10 rounded-full flex-shrink-0">
                  <Clock className="w-4 h-4 text-brand-gold" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white text-sm">
                    Just 10-15 Minutes
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    A complete journey you can fit into any schedule
                  </p>
                </div>
              </div>
            </div>

            <p className="text-center text-sm text-gray-500 dark:text-gray-400 pt-2">
              No prior experience needed. Just come as you are.
            </p>
          </div>

          {/* Action */}
          <div className="flex justify-center">
            <Button
              onClick={() => onOpenChange(false)}
              className="bg-brand-gold hover:bg-brand-gold/90 text-slate-900 px-8"
            >
              Got it, thanks!
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
