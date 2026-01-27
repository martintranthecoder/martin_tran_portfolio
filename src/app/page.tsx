import Experience from "@/components/Experience";
import LinkWithIcon from "@/components/LinkWithIcon";
import Projects from "@/components/Projects";
import Socials from "@/components/Socials";
import SpotifyTopTracks from "@/components/SpotifyTopTracks";
import SwipeCards from "@/components/SwipeCards";
import TravelMap from "@/components/TravelMap";
import { featureFlags } from "@/lib/featureFlags";
import { Button } from "@/components/ui/Button";
import {
  ArrowRightIcon,
  FileDown,
} from "lucide-react";
import Link from "next/link";

import homeContent from "@/data/home.json";

const LIMIT = 2; // max show 2

export default function Home() {

  return (
      <article className="mt-8 flex flex-col gap-16 pb-16">
      <section className="flex flex-col items-start gap-8 md:flex-row-reverse md:items-center md:justify-between">
        <SwipeCards className="md:mr-8" />

        <div className="flex max-w-[320px] flex-col sm:max-w-full">
          <h1 className="title text-balance text-4xl sm:text-5xl">
            {homeContent.introduction.greeting}
          </h1>

          <div className="mt-4 max-w-sm text-balance text-sm sm:text-base space-y-2">
            <p>{homeContent.introduction.description.title}</p>
            <p>
              {homeContent.introduction.description.interest}{" "}
              {homeContent.introduction.description.areas.map((area, index) => (
                <span key={area}>
                  <span className="font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    {area}
                  </span>
                  {index < homeContent.introduction.description.areas.length - 1 && (
                    <span>{index === homeContent.introduction.description.areas.length - 2 ? " & " : ", "}</span>
                  )}
                </span>
              ))}
              .
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

      {featureFlags.spotify && (
        <section className="flex flex-col gap-8">
          <h2 className="title text-2xl sm:text-3xl">now playing</h2>
          <SpotifyTopTracks />
        </section>
      )}

    </article>
  );
}
