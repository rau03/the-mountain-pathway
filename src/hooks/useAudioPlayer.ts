import { useState, useRef, useCallback, useEffect } from "react";

export type AudioTrack = "music" | "nature";

export const useAudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTrack, setActiveTrackState] = useState<AudioTrack>("music");

  // Use refs to hold Audio instances and prevent recreation on renders
  const musicAudioRef = useRef<HTMLAudioElement | null>(null);
  const natureAudioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio elements on first render
  useEffect(() => {
    // Create audio elements if they don't exist
    if (!musicAudioRef.current) {
      musicAudioRef.current = new Audio("/audio/music-ambient-pad.mp3");
      musicAudioRef.current.loop = true;
      musicAudioRef.current.volume = 0.6; // Set music to 60% volume
    }

    if (!natureAudioRef.current) {
      natureAudioRef.current = new Audio("/audio/nature-forest-ambience.mp3");
      natureAudioRef.current.loop = true;
      natureAudioRef.current.volume = 0.8; // Set nature sounds to 80% volume
    }

    // Cleanup function to pause and reset audio when component unmounts
    return () => {
      if (musicAudioRef.current) {
        musicAudioRef.current.pause();
        musicAudioRef.current.currentTime = 0;
      }
      if (natureAudioRef.current) {
        natureAudioRef.current.pause();
        natureAudioRef.current.currentTime = 0;
      }
    };
  }, []);

  // Smart setActiveTrack function that handles track switching
  const setActiveTrack = useCallback(
    async (newTrack: AudioTrack) => {
      const musicAudio = musicAudioRef.current;
      const natureAudio = natureAudioRef.current;

      if (!musicAudio || !natureAudio) return;

      // Don't do anything if we're already on this track
      if (newTrack === activeTrack) return;

      const wasPlaying = isPlaying;

      // Pause and reset the non-active track
      if (newTrack === "music") {
        // Switching to music, so pause and reset nature
        natureAudio.pause();
        natureAudio.currentTime = 0;
      } else {
        // Switching to nature, so pause and reset music
        musicAudio.pause();
        musicAudio.currentTime = 0;
      }

      // Update the active track state
      setActiveTrackState(newTrack);

      // If we were playing, immediately start playing the new track
      if (wasPlaying) {
        try {
          if (newTrack === "music") {
            await musicAudio.play();
          } else {
            await natureAudio.play();
          }
          setIsPlaying(true);
        } catch (error) {
          console.error("Error playing new track:", error);
          setIsPlaying(false);
        }
      }
    },
    [activeTrack, isPlaying]
  );

  // togglePlayPause function that plays or pauses the active track
  const togglePlayPause = useCallback(async () => {
    const musicAudio = musicAudioRef.current;
    const natureAudio = natureAudioRef.current;

    if (!musicAudio || !natureAudio) return;

    try {
      if (isPlaying) {
        // Pause the currently active track
        if (activeTrack === "music") {
          musicAudio.pause();
        } else {
          natureAudio.pause();
        }
        setIsPlaying(false);
      } else {
        // Play the currently active track
        if (activeTrack === "music") {
          await musicAudio.play();
        } else {
          await natureAudio.play();
        }
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("Error toggling audio playback:", error);
      setIsPlaying(false);
    }
  }, [isPlaying, activeTrack]);

  return {
    isPlaying,
    currentTrack: activeTrack,
    togglePlayPause,
    switchTrack: setActiveTrack,
  };
};
