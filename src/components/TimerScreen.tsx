import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Play,
  Pause,
  RotateCcw,
  Heart,
  BookOpen,
  PenLine,
  Lightbulb,
  Star,
  DoorOpen,
  Compass,
  HandHeart,
  LucideIcon,
} from "lucide-react";
import { useStore } from "@/lib/store/useStore";
import { PathwayStep, pathwayContent } from "@/lib/pathway-data";
import { Button } from "@/components/ui/button";

// Icon mapping for dynamic icon rendering
const iconMap: Record<string, LucideIcon> = {
  Heart,
  BookOpen,
  PenLine,
  Lightbulb,
  Star,
  DoorOpen,
  Compass,
  HandHeart,
};

interface TimerScreenProps {
  step: PathwayStep;
}

export const TimerScreen: React.FC<TimerScreenProps> = ({ step }) => {
  const {
    silenceTimer,
    setSilenceTimer,
    isTimerActive,
    startTimer,
    stopTimer,
  } = useStore();
  const [timeLeft, setTimeLeft] = useState(silenceTimer * 60);
  const [hasStarted, setHasStarted] = useState(false);

  // Use ref to track interval for immediate cleanup on completion
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Get the icon component for this step
  const IconComponent = iconMap[step.icon];
  const isTrailheadStep = step.stepIndex === 0;

  const textBlockClass = isTrailheadStep
    ? "relative text-center rounded-2xl overflow-hidden"
    : "text-center space-y-4";
  const titleClass = isTrailheadStep
    ? "text-3xl font-bold text-white mb-2 [text-shadow:0_2px_8px_rgba(0,0,0,0.65)]"
    : "text-3xl font-bold text-slate-900 mb-2";
  const subtitleClass = isTrailheadStep
    ? "text-white text-lg [text-shadow:0_2px_7px_rgba(0,0,0,0.6)]"
    : "text-slate-800 text-lg";
  const promptClass = isTrailheadStep
    ? "text-white leading-relaxed max-w-md mx-auto [text-shadow:0_2px_7px_rgba(0,0,0,0.6)]"
    : "text-slate-800 leading-relaxed max-w-md mx-auto";
  const containerClass = "flex flex-col items-center space-y-4 w-full";
  const preStartControlsClass = "space-y-4 -mt-3";
  const durationLabelClass =
    "block text-sm !text-white [text-shadow:0_1px_4px_rgba(0,0,0,0.45)] mb-4 font-semibold text-center tracking-wide";
  const beginButtonWrapClass = "flex justify-center w-full mt-2";
  const getDurationButtonClass = (isSelected: boolean) =>
    isTrailheadStep
      ? isSelected
        ? "border border-brand-gold/60 shadow-sm"
        : "bg-black/25 text-white border border-white/25 hover:bg-black/35"
      : "";
  const beginButtonClass = isTrailheadStep
    ? "px-8 py-4 rounded-md font-semibold transition-all duration-300 transform hover:scale-105 shadow-md"
    : "px-8 py-4 rounded-md font-semibold transition-all duration-300 transform hover:scale-105";
  const startedStateClass = isTrailheadStep
    ? "space-y-8 bg-black/18 rounded-2xl px-4 py-5 w-full max-w-md"
    : "space-y-8";
  const timerTrackClass = isTrailheadStep
    ? "text-white/35"
    : "text-brand-slate/20";
  const timerTimeClass = isTrailheadStep
    ? "text-3xl font-mono font-bold text-white [text-shadow:0_2px_8px_rgba(0,0,0,0.65)]"
    : "text-3xl font-mono font-bold text-brand-slate";
  const completionMessageClass = isTrailheadStep
    ? "text-white font-medium [text-shadow:0_2px_8px_rgba(0,0,0,0.6)]"
    : "text-brand-slate font-medium drop-shadow-md";
  const completionSubtextClass = isTrailheadStep
    ? "text-white/90 text-sm [text-shadow:0_1px_6px_rgba(0,0,0,0.55)]"
    : "text-brand-slate/80 text-sm";

  useEffect(() => {
    setTimeLeft(silenceTimer * 60);
  }, [silenceTimer]);

  // Timer countdown effect
  useEffect(() => {
    if (!isTimerActive) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isTimerActive]);

  // Separate effect to handle timer completion - prevents race condition
  useEffect(() => {
    if (timeLeft === 0 && isTimerActive) {
      stopTimer();
    }
  }, [timeLeft, isTimerActive, stopTimer]);

  const handleStart = () => {
    setHasStarted(true);
    startTimer();
  };

  const handlePause = () => {
    stopTimer();
  };

  const handleReset = () => {
    stopTimer();
    setTimeLeft(silenceTimer * 60);
    setHasStarted(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = ((silenceTimer * 60 - timeLeft) / (silenceTimer * 60)) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={containerClass}
    >
      <div className={textBlockClass}>
        {isTrailheadStep && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/20" />
        )}
        <div className={isTrailheadStep ? "relative z-10 space-y-4 px-4 py-5" : ""}>
          {/* Step Icon */}
          {IconComponent && (
            <div className="flex justify-center mb-4">
              <div
                className={
                  isTrailheadStep
                    ? "p-4 bg-black/25 backdrop-blur-md rounded-full border border-white/10 overflow-hidden"
                    : "p-4 bg-amber-100 rounded-full"
                }
              >
                <IconComponent className="w-8 h-8 text-brand-gold" />
              </div>
            </div>
          )}

          <div>
            <h2 className={titleClass}>
              {step.title}
            </h2>
            <p className={subtitleClass}>{step.subtitle}</p>
          </div>

          <p className={promptClass}>
            {step.prompt}
          </p>
        </div>
      </div>

      {!hasStarted && (
        <div className={preStartControlsClass}>
          <div>
            <label className={durationLabelClass}>
              {pathwayContent.timerScreen.durationLabel}
            </label>
            <div className="flex justify-center space-x-3">
              {[1, 3, 5, 10].map((minutes) => (
                <Button
                  key={minutes}
                  onClick={() => setSilenceTimer(minutes)}
                  variant={silenceTimer === minutes ? "default" : "ghost"}
                  size="sm"
                  className={getDurationButtonClass(silenceTimer === minutes)}
                >
                  {minutes}m
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}

      {hasStarted && (
        <div className={startedStateClass}>
          {/* Timer Display */}
          <div className="relative">
            <div className="w-40 h-40 mx-auto relative drop-shadow-lg">
              <svg
                className="w-full h-full transform -rotate-90"
                viewBox="0 0 100 100"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="currentColor"
                  strokeWidth="6"
                  fill="none"
                  className={timerTrackClass}
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="currentColor"
                  strokeWidth="6"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 45}`}
                  strokeDashoffset={`${
                    2 * Math.PI * 45 * (1 - progress / 100)
                  }`}
                  className="text-amber-400 transition-all duration-1000 ease-linear drop-shadow-sm"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={timerTimeClass}>
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>
          </div>

          {/* Timer Controls */}
          <div className="flex justify-center space-x-4">
            <Button
              onClick={isTimerActive ? handlePause : handleStart}
              variant="default"
              size="lg"
            >
              {isTimerActive ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
              <span>
                {isTimerActive
                  ? pathwayContent.timerScreen.pauseText
                  : pathwayContent.timerScreen.resumeText}
              </span>
            </Button>

            <Button onClick={handleReset} variant="ghost" size="lg">
              <RotateCcw className="w-4 h-4" />
              <span>{pathwayContent.timerScreen.resetText}</span>
            </Button>
          </div>
        </div>
      )}

      {!hasStarted && (
        <div className={beginButtonWrapClass}>
          <Button
            onClick={handleStart}
            variant="default"
            size="lg"
            className={beginButtonClass}
          >
            <Play className="w-5 h-5" />
            <span>{pathwayContent.timerScreen.beginButtonText}</span>
          </Button>
        </div>
      )}

      {timeLeft === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4"
        >
          <p className={completionMessageClass}>
            {pathwayContent.timerScreen.completionMessage}
          </p>
          <p className={completionSubtextClass}>
            {pathwayContent.timerScreen.completionSubtext}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};
