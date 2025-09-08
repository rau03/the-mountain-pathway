import { useState, useRef, useCallback, useEffect } from "react";

export type AudioTrack = "music" | "nature";

export const useAudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<AudioTrack>("music");

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

  const togglePlayPause = useCallback(async () => {
    const musicAudio = musicAudioRef.current;
    const natureAudio = natureAudioRef.current;

    if (!musicAudio || !natureAudio) return;

    try {
      if (isPlaying) {
        // Pause currently playing track
        musicAudio.pause();
        natureAudio.pause();
        setIsPlaying(false);
      } else {
        // Stop both tracks first
        musicAudio.pause();
        natureAudio.pause();

        // Play only the selected track
        if (currentTrack === "music") {
          await musicAudio.play();
        } else {
          await natureAudio.play();
        }
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("Error toggling audio playback:", error);
      // Reset state if there's an error
      setIsPlaying(false);
    }
  }, [isPlaying, currentTrack]);

  const switchTrack = useCallback(
    (track: AudioTrack) => {
      const musicAudio = musicAudioRef.current;
      const natureAudio = natureAudioRef.current;

      if (!musicAudio || !natureAudio) return;

      // If currently playing, stop current track and play new one
      if (isPlaying) {
        musicAudio.pause();
        natureAudio.pause();

        setCurrentTrack(track);

        // Play the new track
        setTimeout(async () => {
          try {
            if (track === "music") {
              await musicAudio.play();
            } else {
              await natureAudio.play();
            }
          } catch (error) {
            console.error("Error switching audio track:", error);
            setIsPlaying(false);
          }
        }, 100);
      } else {
        // Just change the track selection
        setCurrentTrack(track);
      }
    },
    [isPlaying]
  );

  return {
    isPlaying,
    currentTrack,
    togglePlayPause,
    switchTrack,
  };
};
