import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Play, Pause, Music, Waves } from "lucide-react";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";

interface SimpleAudioPlayerProps {
  context: "landing" | "journey";
}

export const SimpleAudioPlayer: React.FC<SimpleAudioPlayerProps> = ({
  context,
}) => {
  const { isPlaying, currentTrack, togglePlayPause, switchTrack } =
    useAudioPlayer();

  const buttonStyle =
    context === "landing"
      ? "bg-brand-gold text-brand-slate hover:bg-brand-gold/90 w-10 h-10 rounded-full"
      : "bg-black/10 backdrop-blur-sm w-10 h-10 rounded-full border border-brand-slate/20";

  return (
    <div className="flex items-center gap-2">
      {/* 1. PLAY/PAUSE BUTTON */}
      <Button
        onClick={togglePlayPause}
        variant="ghost"
        size="icon"
        className={buttonStyle}
        aria-label={isPlaying ? "Pause audio" : "Play audio"}
      >
        {isPlaying ? (
          <Pause className="h-5 w-5" />
        ) : (
          <Play className="h-5 w-5" />
        )}
      </Button>

      {/* 2. TRACK SELECTION DROPDOWN */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={buttonStyle}
            aria-label="Select audio track"
          >
            {currentTrack === "music" ? (
              <Music className="h-5 w-5" />
            ) : (
              <Waves className="h-5 w-5" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-brand-stone text-brand-slate border-black/10 rounded-lg p-2">
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              switchTrack("music");
            }}
            className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer hover:bg-brand-slate/10"
          >
            <Music className="h-4 w-4" />
            <span>Ambient</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              switchTrack("nature");
            }}
            className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer hover:bg-brand-slate/10"
          >
            <Waves className="h-4 w-4" />
            <span>Nature</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
