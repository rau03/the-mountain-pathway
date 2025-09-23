import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, Music, Waves, Settings } from "lucide-react";
import { useStore } from "@/lib/store/useStore";

export const AudioPlayer: React.FC = () => {
  const { audioEnabled, currentAudioTrack, toggleAudio, setAudioTrack } =
    useStore();
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-30">
      <div className="flex flex-col items-end space-y-2">
        {/* Audio Settings Panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="bg-slate-800/90 backdrop-blur-sm rounded-lg p-4 shadow-xl border border-slate-600 mb-2"
            >
              <div className="space-y-3">
                <p className="text-sm text-slate-300 font-medium">
                  Audio Track
                </p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setAudioTrack("music")}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                      currentAudioTrack === "music"
                        ? "bg-brand-forest text-white"
                        : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                    }`}
                  >
                    <Music className="w-4 h-4" />
                    <span>Music</span>
                  </button>
                  <button
                    onClick={() => setAudioTrack("nature")}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                      currentAudioTrack === "nature"
                        ? "bg-brand-forest text-white"
                        : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                    }`}
                  >
                    <Waves className="w-4 h-4" />
                    <span>Nature</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-3 bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white rounded-full transition-all duration-200 backdrop-blur-sm border border-slate-600"
          >
            <Settings className="w-4 h-4" />
          </button>

          <button
            onClick={toggleAudio}
            className={`p-3 rounded-full transition-all duration-200 backdrop-blur-sm border ${
              audioEnabled
                ? "bg-brand-forest/80 hover:bg-brand-forest/90 text-white border-brand-forest"
                : "bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border-slate-600"
            }`}
          >
            {audioEnabled ? (
              <Volume2 className="w-5 h-5" />
            ) : (
              <VolumeX className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Audio Elements */}
      {audioEnabled && (
        <>
          <audio
            loop
            autoPlay
            className="hidden"
            style={{
              display: currentAudioTrack === "music" ? "block" : "none",
            }}
          >
            <source
              src="https://www.soundjay.com/misc/sounds/bell-ringing-05.wav"
              type="audio/wav"
            />
          </audio>
          <audio
            loop
            autoPlay
            className="hidden"
            style={{
              display: currentAudioTrack === "nature" ? "block" : "none",
            }}
          >
            <source
              src="https://www.soundjay.com/nature/sounds/forest-with-small-river.wav"
              type="audio/wav"
            />
          </audio>
        </>
      )}
    </div>
  );
};
