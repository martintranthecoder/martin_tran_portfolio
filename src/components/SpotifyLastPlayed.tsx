import Image from "next/image";
import { getLastPlayed } from "@/lib/spotify";

function timeAgo(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "just now";
  const diffSec = Math.max(1, Math.floor((Date.now() - then) / 1000));
  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  return `${diffDay}d ago`;
}

export default async function SpotifyLastPlayed() {
  const track = await getLastPlayed();
  if (!track) return null;

  return (
    <a
      href={track.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block"
      aria-label={`Open ${track.name} by ${track.artist} on Spotify`}
    >
      <div className="relative rounded-md border border-yellow-400/70 bg-zinc-950 px-6 pb-6 pt-8 font-mono text-zinc-200 transition-colors group-hover:border-yellow-300">
        {/* notch label */}
        <span className="absolute -top-2.5 left-4 bg-zinc-950 px-2 text-xs font-bold text-yellow-400">
          last played
        </span>

        <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:gap-10">
          {/* Album cover */}
          <div className="relative size-32 flex-shrink-0 overflow-hidden rounded-md sm:size-40">
            <Image
              src={track.albumArt}
              alt={`${track.name} album art`}
              fill
              className="object-cover"
              sizes="160px"
            />
          </div>

          {/* Stats column */}
          <div className="flex-1 min-w-0">
            <h3 className="mb-3 truncate text-lg font-bold text-zinc-100">
              {track.name}
            </h3>

            <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1 text-sm">
              <dt className="text-zinc-400">artist</dt>
              <dd className="truncate text-right font-bold text-yellow-400">
                {track.artist}
              </dd>

              <dt className="text-zinc-400">album</dt>
              <dd className="truncate text-right font-bold text-emerald-400">
                {track.album}
              </dd>

              <dt className="text-zinc-400">duration</dt>
              <dd className="text-right font-bold text-zinc-100">
                {track.duration}
              </dd>

              <dt className="text-zinc-400">played</dt>
              <dd className="text-right font-bold text-zinc-100">
                {timeAgo(track.playedAt)}
              </dd>
            </dl>

            <div className="mt-5 flex gap-6 text-xs text-zinc-500">
              <span>
                <span className="text-zinc-400">click</span> open in spotify
              </span>
            </div>
          </div>
        </div>
      </div>
    </a>
  );
}
