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
        className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-slate-700"
      >
        <div className="text-center space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">{step.title}</h2>
            <p className="text-slate-300 text-lg">{step.subtitle}</p>
          </div>

          <p className="text-slate-400 leading-relaxed">{step.prompt}</p>

          {!hasStarted && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-300 mb-2">
                  {pathwayContent.timerScreen.durationLabel}
                </label>
                <div className="flex justify-center space-x-2">
                  {[1, 3, 5, 10].map((minutes) => (
                    <button
                      key={minutes}
                      onClick={() => setSilenceTimer(minutes)}
                      className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                        silenceTimer === minutes
                          ? "bg-amber-600 text-white"
                          : "bg-slate-700 text-slate-300 hover:bg-slate-600"
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
            <div className="space-y-6">
              {/* Timer Display */}
              <div className="relative">
                <div className="w-32 h-32 mx-auto relative">
                  <svg
                    className="w-full h-full transform -rotate-90"
                    viewBox="0 0 100 100"
                  >
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-slate-700"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 45}`}
                      strokeDashoffset={`${
                        2 * Math.PI * 45 * (1 - progress / 100)
                      }`}
                      className="text-amber-400 transition-all duration-1000 ease-linear"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-mono font-bold text-white">
                      {formatTime(timeLeft)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Timer Controls */}
              <div className="flex justify-center space-x-4">
                <button
                  onClick={isTimerActive ? handlePause : handleStart}
                  className="flex items-center space-x-2 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-all duration-200"
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
                  className="flex items-center space-x-2 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all duration-200"
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
              className="flex items-center space-x-2 mx-auto px-8 py-4 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
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
              <p className="text-amber-400 font-medium">
                {pathwayContent.timerScreen.completionMessage}
              </p>
              <p className="text-slate-300 text-sm">
                {pathwayContent.timerScreen.completionSubtext}
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
