import { Experience } from "@/lib/schemas";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/Avatar";
import { Badge } from "./ui/Badge";
import Icon from "./Icon";

interface Props {
  experience: Experience;
}

export default function TimelineItem({ experience }: Props) {
  const { name, href, logo, positions } = experience;

  return (
    <li className="relative ml-10 py-4">
      <Link
        href={href}
        target="_blank"
        className="absolute -left-16 top-4 flex items-center justify-center rounded-full bg-white"
      >
        <Avatar className="size-12 border">
          <AvatarImage
            src={logo}
            alt={name}
            className="bg-background object-contain"
          />
          <AvatarFallback>{name[0]}</AvatarFallback>
        </Avatar>
      </Link>
      <div className="flex flex-1 flex-col justify-start gap-1">
        <h2 className="font-semibold leading-none">{name}</h2>

        {/* Render each position at this company */}
        {positions.map((position, idx) => (
          <div key={idx} className={idx > 0 ? "mt-4" : ""}>
            {position.start && (
              <time className="text-xs text-muted-foreground">
                <span>{position.start}</span>
                <span>{" - "}</span>
                <span>{position.end ? position.end : "Present"}</span>
              </time>
            )}
            {position.title && (
              <p className="text-sm font-medium text-muted-foreground">
                {position.title}
              </p>
            )}
            {position.description && (
              <ul className="ml-4 list-outside list-disc">
                {position.description.map((desc, i) => (
                  <li key={i} className="prose pr-8 text-sm dark:prose-invert">
                    {desc}
                  </li>
                ))}
              </ul>
            )}
            {position.links && position.links.length > 0 && (
              <div className="mt-2 flex flex-row flex-wrap items-start gap-2">
                {position.links.map((link, linkIdx) => (
                  <Link href={link.href} key={linkIdx}>
                    <Badge title={link.name} className="flex gap-2">
                      <Icon
                        name={link.icon}
                        aria-hidden="true"
                        className="size-3"
                      />
                      {link.name}
                    </Badge>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </li>
  );
}
