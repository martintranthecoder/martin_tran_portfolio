import { getTopTracks } from "@/lib/spotify";
import SpotifyTrackCard from "./SpotifyTrackCard";

// Revalidate every hour
export const revalidate = 3600;

export default async function SpotifyTopTracks() {
  const tracks = await getTopTracks();

  if (tracks.length === 0) {
    return null;
  }

  const [featuredTrack, ...restTracks] = tracks;

  return (
    <div className="flex flex-col md:flex-row gap-4">
      {/* Featured Track #1 - Left Side */}
      <div className="md:w-[45%] flex-shrink-0">
        <SpotifyTrackCard track={featuredTrack} isFeatured={true} />
      </div>

      {/* Tracks 2-5 - Right Side */}
      <div className="flex-1 flex flex-col gap-3">
        {restTracks.map((track) => (
          <SpotifyTrackCard key={track.id} track={track} isFeatured={false} />
        ))}
      </div>
    </div>
  );
}
