import { Suspense } from "react";
import Experience from "@/components/Experience";
import JellyfishText from "@/components/JellyfishText";
import LinkWithIcon from "@/components/LinkWithIcon";
import Projects from "@/components/Projects";
import Socials from "@/components/Socials";
import SpotifyLastPlayed from "@/components/SpotifyLastPlayed";
import SpotifyTopTracks from "@/components/SpotifyTopTracks";
import SwipeCards from "@/components/SwipeCards";
import TravelMap from "@/components/TravelMap";
import TextType from "@/components/TextType";
import { Button } from "@/components/ui/Button";
import {
  ArrowRightIcon,
  FileDown,
} from "lucide-react";
import Link from "next/link";

import homeContent from "@/data/home.json";

export const revalidate = 3600;

const LIMIT = 2; // max show 2

function SpotifyTopTracksFallback() {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="md:w-[45%] flex-shrink-0">
        <div className="aspect-square w-full animate-pulse rounded-lg bg-muted" />
      </div>
      <div className="flex-1 flex flex-col gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-16 animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
    </div>
  );
}

export default function Home() {

  return (
      <article className="mt-8 flex flex-col gap-16 pb-16">
      <section className="flex flex-col items-start gap-8 md:flex-row-reverse md:items-center md:justify-between">
        <SwipeCards className="md:mr-8" />

        <div className="flex max-w-[320px] flex-col sm:max-w-full">
          <h1 className="title text-balance text-4xl sm:text-5xl">
            <TextType
              text={[homeContent.introduction.greeting]}
              typingSpeed={75}
              pauseDuration={5000}
              showCursor
              cursorCharacter="_"
              deletingSpeed={50}
              loop
            />
          </h1>

          <div className="mt-4 max-w-sm text-balance text-sm sm:text-base space-y-2">
            <p>{homeContent.introduction.description.title}</p>
            <p>
              {homeContent.introduction.description.interest}{" "}
              {homeContent.introduction.description.areas.map((area, index) => {
                const dotColors = [
                  "hsl(var(--chart-1))",
                  "hsl(var(--chart-2))",
                  "hsl(var(--chart-4))",
                  "hsl(var(--chart-5))",
                  "hsl(var(--chart-3))",
                ];
                const rotations = ["-1deg", "0.6deg", "-0.4deg", "0.8deg", "-0.7deg"];
                return (
                  <span key={area}>
                    <span
                      className="group/pill inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-border/60 bg-muted/60 px-2.5 py-0.5 font-mono text-[0.78em] leading-normal text-foreground shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all duration-300 ease-out rotate-[var(--r)] hover:-translate-y-0.5 hover:rotate-0 hover:border-foreground/35 hover:bg-muted hover:shadow-[0_4px_10px_-2px_rgba(0,0,0,0.10)]"
                      style={{ ["--r" as string]: rotations[index] ?? "0deg" }}
                    >
                      <span
                        className="size-1.5 rounded-full transition-transform duration-300 ease-out group-hover/pill:scale-150"
                        style={{ backgroundColor: dotColors[index % dotColors.length] }}
                      />
                      {area}
                    </span>
                    {index < homeContent.introduction.description.areas.length - 1 && " "}
                  </span>
                );
              })}
              .
            </p>
            <p>
              Most importantly, I love <JellyfishText />.
            </p>
            <p className="text-muted-foreground">
              {homeContent.introduction.description.greeting}
            </p>
          </div>

          <p className="mt-4 text-xs font-light">
            {homeContent.introduction.escalation.text}
            <Link
              href={homeContent.escalationLink.href}
              className="link font-semibold"
              title={homeContent.escalationLink.title}
            >
              &nbsp;{homeContent.introduction.escalation.linkText}
              &nbsp;
            </Link>
            {homeContent.introduction.escalation.suffix}
          </p>

          <section className="mt-6 flex flex-wrap items-center gap-4">
            <Link href="/resume.pdf" target="_blank">
              <Button variant="outline">
                <span className="font-semibold">Resume</span>
                <FileDown className="ml-2 size-5" />
              </Button>
            </Link>
            <Socials />
          </section>
        </div>
      </section>

      <Experience />

      <section className="flex flex-col gap-8">
        <h2 className="title text-2xl sm:text-3xl">where i&apos;ve been</h2>
        <TravelMap />
      </section>

      <section className="flex flex-col gap-8">
        <div className="flex justify-between">
          <h2 className="title text-2xl sm:text-3xl">featured projects</h2>
          <LinkWithIcon
            href="/projects"
            position="right"
            icon={<ArrowRightIcon className="size-5" />}
            text="view more"
          />
        </div>
        <Projects limit={LIMIT} />
      </section>

      <section className="flex flex-col gap-8">
        <h2 className="title text-2xl sm:text-3xl">top tracks</h2>
        <Suspense fallback={<SpotifyTopTracksFallback />}>
          <SpotifyTopTracks />
        </Suspense>
        <Suspense fallback={null}>
          <SpotifyLastPlayed />
        </Suspense>
      </section>

    </article>
  );
}
