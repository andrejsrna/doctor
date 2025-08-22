import { z } from "zod"

export const ReleaseSchema = z.object({
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers, and hyphens only"),
  title: z.string().min(1, "Title is required"),
  content: z.string().nullable().optional(),
  coverImageUrl: z.string().url().nullable().optional().or(z.literal("")),
  previewUrl: z.string().url().nullable().optional().or(z.literal("")),
  spotify: z.string().url().nullable().optional().or(z.literal("")),
  appleMusic: z.string().url().nullable().optional().or(z.literal("")),
  beatport: z.string().url().nullable().optional().or(z.literal("")),
  deezer: z.string().url().nullable().optional().or(z.literal("")),
  soundcloud: z.string().url().nullable().optional().or(z.literal("")),
  youtubeMusic: z.string().url().nullable().optional().or(z.literal("")),
  junoDownload: z.string().url().nullable().optional().or(z.literal("")),
  tidal: z.string().url().nullable().optional().or(z.literal("")),
  gumroad: z.string().url().nullable().optional().or(z.literal("")),
  bandcamp: z.string().url().nullable().optional().or(z.literal("")),
  categories: z.array(z.string()).default([]).optional(),
  publishedAt: z.string().nullable().optional(),
})

export type ReleaseFormValues = z.infer<typeof ReleaseSchema>

export const linkFields: Array<{ key: keyof ReleaseFormValues; label: string; type?: string }> = [
  {key: "spotify", label: "Spotify"},
  {key: "appleMusic", label: "Apple Music"},
  {key: "beatport", label: "Beatport"},
  {key: "deezer", label: "Deezer"},
  {key: "soundcloud", label: "SoundCloud"},
  {key: "gumroad", label: "Gumroad"},
  {key: "bandcamp", label: "Bandcamp"},
  {key: "youtubeMusic", label: "YouTube Music"},
  {key: "junoDownload", label: "JunoDownload"},
  {key: "tidal", label: "Tidal"},
]
