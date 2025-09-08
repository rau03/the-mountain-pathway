import React, { useState } from 'react';
import { useAudioPlayer, AudioTrack } from '../hooks/useAudioPlayer';

interface AudioToggleProps {
  className?: string;
}

export const AudioToggle: React.FC<AudioToggleProps> = ({ className = '' }) => {
  const { isPlaying, currentTrack, togglePlayPause, switchTrack } = useAudioPlayer();
  const [showTrackSelector, setShowTrackSelector] = useState(false);

  return (
    <div className={`fixed top-4 right-4 z-50 ${className}`}>
      {/* Track Selector Panel */}
      {showTrackSelector && (
        <div className="mb-2 bg-white/20 backdrop-blur-sm rounded-lg border border-white/30 p-3 shadow-lg">
          <p className="text-white text-sm font-medium mb-2">Select Track</p>
          <div className="flex flex-col space-y-2">
            <button
              onClick={() => {
                switchTrack('music');
                setShowTrackSelector(false);
              }}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                currentTrack === 'music'
                  ? 'bg-white/30 text-white'
                  : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-current">
                <path d="M9 18V5l12-2v13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="6" cy="18" r="3" stroke="currentColor" strokeWidth="2"/>
                <circle cx="18" cy="16" r="3" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <span>Ambient Music</span>
            </button>
            <button
              onClick={() => {
                switchTrack('nature');
                setShowTrackSelector(false);
              }}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                currentTrack === 'nature'
                  ? 'bg-white/30 text-white'
                  : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-current">
                <path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.19 3 12.25c0 2.22 1.8 4.05 4 4.05z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2.04 4.6 4.14 6.12s4.58 2.48 5.86 4.5c0 0-2.72-.75-7.5-7.04z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Nature Sounds</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Controls */}
      <div className="flex items-center space-x-2">
        {/* Track Selector Button */}
        <button
          onClick={() => setShowTrackSelector(!showTrackSelector)}
          className="w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full border border-white/30 flex items-center justify-center transition-all duration-200 ease-in-out hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
          aria-label="Select audio track"
          title="Select audio track"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-white">
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Play/Pause Button */}
        <button
          onClick={togglePlayPause}
          className="w-12 h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full border border-white/30 flex items-center justify-center transition-all duration-200 ease-in-out hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
          aria-label={isPlaying ? `Pause ${currentTrack} audio` : `Play ${currentTrack} audio`}
          title={isPlaying ? `Pause ${currentTrack} audio` : `Play ${currentTrack} audio`}
        >
          {isPlaying ? (
            // Pause icon
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              className="text-white"
            >
              <rect x="6" y="4" width="4" height="16" fill="currentColor" rx="1" />
              <rect x="14" y="4" width="4" height="16" fill="currentColor" rx="1" />
            </svg>
          ) : (
            // Play icon
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              className="text-white ml-1"
            >
              <polygon
                points="5,3 19,12 5,21"
                fill="currentColor"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Current Track Indicator */}
      <div className="mt-2 text-center">
        <span className="text-white/70 text-xs">
          {currentTrack === "music" ? "🎵 Ambient" : "🌿 Nature"}
        </span> 
      </div>
    </div>
  );
};              