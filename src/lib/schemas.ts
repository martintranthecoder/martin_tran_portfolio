import dynamicIconImports from "lucide-react/dynamicIconImports";
import { z } from "zod";

export const ContactFormSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required." })
    .min(2, { message: "Must be at least 2 characters." }),
  email: z
    .string()
    .min(1, { message: "Email is required." })
    .email("Invalid email."),
  message: z.string().min(1, { message: "Message is required." }),
});

const iconLink = z.object({
  name: z.string(),
  href: z.string().url(),
  icon: z.custom<keyof typeof dynamicIconImports>(),
});
export type IconLink = z.infer<typeof iconLink>;

const project = z.object({
  name: z.string(),
  description: z.string(),
  href: z.string().url().optional(),
  image: z.string().optional(),
  status: z.enum(["Completed", "In Development"]).optional(),
  tags: z.array(z.string()),
  links: z.array(iconLink),
});
export const projectSchema = z.object({ projects: z.array(project) });
export type Project = z.infer<typeof project>;

const position = z.object({
  title: z.string(),
  start: z.string(),
  end: z.string().optional(),
  description: z.array(z.string()).optional(),
  links: z.array(iconLink).optional(),
});
export type Position = z.infer<typeof position>;

const experience = z.object({
  name: z.string(),
  href: z.string(),
  logo: z.string(),
  positions: z.array(position),
});
export type Experience = z.infer<typeof experience>;

export const careerSchema = z.object({ career: z.array(experience) });
export const educationSchema = z.object({ education: z.array(experience) });
export const socialSchema = z.object({ socials: z.array(iconLink) });

const musicTrack = z.object({
  id: z.string(),
  name: z.string(),
  artist: z.string(),
  albumArt: z.string().url(),
  duration: z.string(),
  url: z.string().url(),
});
export type MusicTrack = z.infer<typeof musicTrack>;

export const musicTracksSchema = z.object({
  tracks: z.array(musicTrack),
});

const travelLocation = z.object({
  id: z.number(),
  city: z.string(),
  country: z.string(),
  coordinates: z.tuple([z.number(), z.number()]),
  current: z.boolean().optional(),
});
export type TravelLocation = z.infer<typeof travelLocation>;

export const travelsSchema = z.object({
  travels: z.array(travelLocation),
});
