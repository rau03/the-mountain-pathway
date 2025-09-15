import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Pause, RotateCcw } from "lucide-react";
import { useStore } from "@/lib/store/useStore";
import { PathwayStep, pathwayContent } from "@/lib/pathway-data";

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
            <h2 className="text-3xl font-bold text-white drop-shadow-md mb-2">
              {step.title}
            </h2>
            <p className="text-white/90 text-lg drop-shadow-md">
              {step.subtitle}
            </p>
          </div>

          <p className="text-white/80 leading-relaxed drop-shadow-md max-w-md mx-auto">
            {step.prompt}
          </p>
        </div>

        {!hasStarted && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm text-white/80 drop-shadow-md mb-4 font-medium">
                {pathwayContent.timerScreen.durationLabel}
              </label>
              <div className="flex justify-center space-x-3">
                {[1, 3, 5, 10].map((minutes) => (
                  <button
                    key={minutes}
                    onClick={() => setSilenceTimer(minutes)}
                    className={`px-4 py-2 rounded-lg transition-all duration-200 backdrop-blur-sm border ${
                      silenceTimer === minutes
                        ? "bg-amber-600/90 text-white border-amber-500 shadow-lg"
                        : "bg-white/10 text-white/90 border-white/20 hover:bg-white/20 hover:border-white/30"
                    }`}
                  >
                    {minutes}m
                  </button>
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
                    className="text-white/20"
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
                  <span className="text-3xl font-mono font-bold text-white drop-shadow-md">
                    {formatTime(timeLeft)}
                  </span>
                </div>
              </div>
            </div>

            {/* Timer Controls */}
            <div className="flex justify-center space-x-4">
              <button
                onClick={isTimerActive ? handlePause : handleStart}
                className="flex items-center space-x-2 px-6 py-3 bg-amber-600/90 hover:bg-amber-700/90 text-white rounded-lg transition-all duration-200 backdrop-blur-sm border border-amber-500/50 shadow-lg drop-shadow-md"
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
              </button>

              <button
                onClick={handleReset}
                className="flex items-center space-x-2 px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-200 backdrop-blur-sm border border-white/20 hover:border-white/30 drop-shadow-md"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{pathwayContent.timerScreen.resetText}</span>
              </button>
            </div>
          </div>
        )}

        {!hasStarted && (
          <button
            onClick={handleStart}
            className="flex items-center space-x-2 mx-auto px-8 py-4 bg-amber-600/90 hover:bg-amber-700/90 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 backdrop-blur-sm border border-amber-500/50 shadow-lg drop-shadow-md"
          >
            <Play className="w-5 h-5" />
            <span>{pathwayContent.timerScreen.beginButtonText}</span>
          </button>
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
            <p className="text-white/80 text-sm drop-shadow-md">
              {pathwayContent.timerScreen.completionSubtext}
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
