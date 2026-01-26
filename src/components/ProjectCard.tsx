import { Badge } from "@/components/ui/Badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Project } from "@/lib/schemas";
import { CheckCircle2, Construction } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Markdown from "react-markdown";
import Icon from "./Icon";

interface Props {
  project: Project;
}

const DEFAULT_PROJECT_IMAGE = "/img/default.jpeg";

const statusConfig = {
  "Completed": {
    icon: CheckCircle2,
    className: "bg-green-500/90 text-white",
    label: "Completed",
  },
  "In Development": {
    icon: Construction,
    className: "bg-yellow-500/90 text-white",
    label: "In Dev",
  },
};

export function ProjectCard({ project }: Props) {
  const { name, href, description, image, tags, links, status } = project;
  const projectImage = image || DEFAULT_PROJECT_IMAGE;
  const statusInfo = status ? statusConfig[status] : null;

  return (
    <Card className="flex flex-col">
      <CardHeader className="relative">
        {statusInfo && (
          <div className={`absolute top-2 right-2 z-10 rounded-full p-1.5 shadow-md ${statusInfo.className}`}>
            <statusInfo.icon className="size-4" />
          </div>
        )}
        <Link href={href || projectImage}>
          <Image
            src={projectImage}
            alt={name}
            width={500}
            height={300}
            className="h-40 w-full object-cover object-top"
          />
        </Link>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <CardTitle>{name}</CardTitle>
        <Markdown className="prose max-w-full text-pretty font-sans text-xs text-muted-foreground dark:prose-invert">
          {description}
        </Markdown>
      </CardContent>
      <CardFooter className="flex h-full flex-col items-start justify-between gap-4">
        {tags && tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {tags.toSorted().map((tag) => (
              <Badge
                key={tag}
                className="px-1 py-0 text-[10px]"
                variant="secondary"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
        {links && links.length > 0 && (
          <div className="flex flex-row flex-wrap items-start gap-1">
            {links.toSorted().map((link, idx) => (
              <Link href={link?.href} key={idx} target="_blank">
                <Badge key={idx} className="flex gap-2 px-2 py-1 text-[10px]">
                  <Icon name={link.icon} className="size-3" />
                  {link.name}
                </Badge>
              </Link>
            ))}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
