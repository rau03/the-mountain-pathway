import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Pause, RotateCcw } from "lucide-react";
import { useStore } from "@/lib/store/useStore";
import { PathwayStep, pathwayContent } from "@/lib/pathway-data";
import { Button } from "@/components/ui/button";

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

  useEffect(() => {
    setTimeLeft(silenceTimer * 60);
  }, [silenceTimer]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isTimerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            stopTimer();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isTimerActive, timeLeft, stopTimer]);

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
    <div className="w-full max-w-lg mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center min-h-[60vh] space-y-8"
      >
        <div className="text-center space-y-4">
          <div>
            <h2 className="text-3xl font-bold text-brand-slate mb-2">
              {step.title}
            </h2>
            <p className="text-brand-slate/90 text-lg">{step.subtitle}</p>
          </div>

          <p className="text-brand-slate/80 leading-relaxed max-w-md mx-auto">
            {step.prompt}
          </p>
        </div>

        {!hasStarted && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm text-brand-slate/80 mb-4 font-medium text-center">
                {pathwayContent.timerScreen.durationLabel}
              </label>
              <div className="flex justify-center space-x-3">
                {[1, 3, 5, 10].map((minutes) => (
                  <Button
                    key={minutes}
                    onClick={() => setSilenceTimer(minutes)}
                    variant={silenceTimer === minutes ? "default" : "ghost"}
                    size="sm"
                  >
                    {minutes}m
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}

        {hasStarted && (
          <div className="space-y-8">
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
                    className="text-brand-slate/20"
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
                  <span className="text-3xl font-mono font-bold text-brand-slate">
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
          <Button
            onClick={handleStart}
            variant="default"
            size="lg"
            className="mx-auto px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
          >
            <Play className="w-5 h-5" />
            <span>{pathwayContent.timerScreen.beginButtonText}</span>
          </Button>
        )}

        {timeLeft === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-4"
          >
            <p className="text-amber-400 font-medium drop-shadow-md">
              {pathwayContent.timerScreen.completionMessage}
            </p>
            <p className="text-brand-slate/80 text-sm">
              {pathwayContent.timerScreen.completionSubtext}
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
