"use client";

import Image from "next/image";
import { Card, CardContent } from "./ui/Card";
import { MusicTrack } from "@/lib/schemas";
import { Play } from "lucide-react";

interface SpotifyTrackCardProps {
  track: MusicTrack;
  isFeatured?: boolean;
}

export default function SpotifyTrackCard({
  track,
  isFeatured = false,
}: SpotifyTrackCardProps) {
  if (isFeatured) {
    // Featured Track #1 - Large vertical layout
    return (
      <Card className="overflow-hidden h-full flex flex-col">
        <CardContent className="p-6 flex flex-col flex-1">
          {/* Large Album Artwork */}
          <div className="relative w-full flex-1 rounded-lg overflow-hidden mb-4 min-h-0">
            <Image
              src={track.albumArt}
              alt={`${track.name} album art`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 300px"
              priority
            />
          </div>

          {/* Track Info */}
          <div className="flex-shrink-0">
            <h3 className="font-bold text-lg line-clamp-2 mb-1">
              {track.name}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {track.artist}
            </p>
          </div>

          {/* Duration and Play Button */}
          <div className="flex items-center justify-between flex-shrink-0">
            <span className="text-sm text-muted-foreground font-mono">
              {track.duration}
            </span>
            <button
              onClick={() => window.open(track.url, "_blank")}
              className="rounded-full p-3 bg-[#1DB954] hover:bg-[#1ed760] text-white transition-all hover:scale-105"
              aria-label="Play on Spotify"
            >
              <Play className="size-5 fill-current" />
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Compact Track (2-5) - Horizontal row layout
  return (
    <Card className="overflow-hidden hover:bg-accent/50 transition-colors">
      <CardContent className="p-3">
        <div className="flex items-center gap-3">
          {/* Small Album Artwork */}
          <div className="relative flex-shrink-0 size-12 rounded overflow-hidden">
            <Image
              src={track.albumArt}
              alt={`${track.name} album art`}
              fill
              className="object-cover"
              sizes="48px"
            />
          </div>

          {/* Track Info */}
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-sm truncate">{track.name}</h4>
            <p className="text-xs text-muted-foreground truncate">
              {track.artist}
            </p>
          </div>

          {/* Duration and Play Button */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-xs text-muted-foreground font-mono">
              {track.duration}
            </span>
            <button
              onClick={() => window.open(track.url, "_blank")}
              className="rounded-full p-2 hover:bg-accent transition-colors"
              aria-label="Play on Spotify"
            >
              <Play className="size-4 fill-current" />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
