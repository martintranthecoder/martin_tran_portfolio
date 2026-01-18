"use server";

import { spotifyTracksSchema, SpotifyTrack } from "./schemas";
import fallbackData from "@/data/spotify-fallback.json";

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const SPOTIFY_REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN;

// In-memory cache for access token
let tokenCache: {
  accessToken: string;
  expiresAt: number;
} | null = null;

/**
 * Refresh the Spotify access token using the refresh token
 */
async function refreshAccessToken(): Promise<string> {
  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET || !SPOTIFY_REFRESH_TOKEN) {
    throw new Error("Spotify credentials not configured");
  }

  const basic = Buffer.from(
    `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`,
  ).toString("base64");

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: SPOTIFY_REFRESH_TOKEN,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to refresh token: ${response.statusText}`);
  }

  const data = await response.json();

  // Cache the new token (expires in 3600 seconds, cache for 59 minutes)
  tokenCache = {
    accessToken: data.access_token,
    expiresAt: Date.now() + 59 * 60 * 1000, // 59 minutes from now
  };

  return data.access_token;
}

/**
 * Get a valid access token (from cache or refresh)
 */
async function getAccessToken(): Promise<string> {
  // Check if we have a valid cached token
  if (tokenCache && tokenCache.expiresAt > Date.now()) {
    return tokenCache.accessToken;
  }

  // Token expired or doesn't exist, refresh it
  return await refreshAccessToken();
}

/**
 * Format duration from milliseconds to "M:SS" format
 */
function formatDuration(durationMs: number): string {
  const totalSeconds = Math.floor(durationMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

/**
 * Fetch top tracks from Spotify API
 */
export async function getTopTracks(): Promise<SpotifyTrack[]> {
  try {
    const accessToken = await getAccessToken();

    const response = await fetch(
      "https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=5",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        next: { revalidate: 3600 }, // Cache for 1 hour
      },
    );

    if (!response.ok) {
      throw new Error(`Spotify API error: ${response.statusText}`);
    }

    const data = await response.json();

    // Transform Spotify API response to our schema
    const tracks: SpotifyTrack[] = data.items.map((item: any) => ({
      id: item.id,
      name: item.name,
      artist: item.artists[0].name,
      albumArt: item.album.images[1]?.url || item.album.images[0]?.url,
      duration: formatDuration(item.duration_ms),
      url: item.external_urls.spotify,
    }));

    // Validate with Zod schema
    const validated = spotifyTracksSchema.parse({ tracks });
    return validated.tracks;
  } catch (error) {
    console.error("Error fetching Spotify top tracks:", error);

    // Return fallback data if API fails
    const validated = spotifyTracksSchema.parse(fallbackData);
    return validated.tracks;
  }
}
