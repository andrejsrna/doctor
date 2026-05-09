import type { PrismaClient } from "@prisma/client"

export const ARTIST_SHORT_VIDEO_DOCUMENT_ID = "short-video-basics-default"
const title = "Short Video Basics"
const category = "Short Video"

const content = `## What this is for

Short videos do not need a full production setup. For release campaigns, one clean 10 to 20 second clip can do more than a polished video that never gets finished.

## Basic format

- Keep it between 10 and 20 seconds.
- Start near the strongest moment: drop, switch, bass hit, vocal, or hook.
- Use vertical format for Reels, TikTok and Shorts.
- Add one clear text line so people understand the clip without sound.
- End with a simple action: listen, save, follow, or check the full release.

## Easy visual options

- Waveform or visualizer loop.
- Artwork motion or slow zoom.
- DAW screen recording.
- Studio phone video.
- Bass before and after clip.
- Drop moment with a clean title overlay.
- Short live or DJ clip if you have one.

## Text overlays

- Keep text short enough to read in one second.
- Use one idea per clip.
- Put the title or message away from app UI areas.
- Good examples: “raw bass to final drop”, “new one on DnB Doctor”, “this drop started as a 2am loop”.

## Sound choice

- Use the strongest part of the track, not a long intro.
- If the tune has a big switch, show the switch.
- If the bass design is the hook, show the bass.
- Avoid clips where the first seconds feel empty.

## CTA examples

- Full track out now.
- Link in bio.
- Save this if you feel the drop.
- New DnB Doctor release.
- Drop your thoughts below.

## Simple rule

Make the clip obvious fast: what is this, why should someone keep watching, and where should they go next.`

const checklist = [
  {
    title: "Choose one 10 to 20 second drop moment",
    description: "Pick the strongest part of the track for short video: drop, switch, bass hit, vocal, hook or high-energy moment.",
    priority: "HIGH",
  },
  {
    title: "Prepare one vertical video format",
    description: "Export or record the clip in a vertical format that works for Reels, TikTok and Shorts.",
    priority: "HIGH",
  },
  {
    title: "Add one short text overlay",
    description: "Write one clear line that explains the clip quickly, such as 'raw bass to final drop' or 'new DnB Doctor release'.",
    priority: "NORMAL",
  },
  {
    title: "Create one waveform or artwork loop",
    description: "Use a simple waveform, artwork motion, slow zoom or visualizer loop if you do not have camera footage.",
    priority: "NORMAL",
  },
  {
    title: "Write one simple CTA",
    description: "Add a direct next step: link in bio, full track out now, save this, follow for the release, or comment your thoughts.",
    priority: "NORMAL",
  },
  {
    title: "Check that text is readable on mobile",
    description: "Make sure captions and titles are not hidden by Reels, TikTok or Shorts interface buttons.",
    priority: "NORMAL",
  },
  {
    title: "Save the final clip for reuse",
    description: "Keep the exported clip so it can be reused by you or sent to the label when needed.",
    priority: "LOW",
  },
] as const

export async function ensureArtistShortVideoDocument(prisma: PrismaClient) {
  return prisma.artistDocument.upsert({
    where: { id: ARTIST_SHORT_VIDEO_DOCUMENT_ID },
    update: {
      title,
      description: "How to prepare Reels, TikTok and Shorts without big production: short clip, drop moment, overlay and CTA.",
      type: "NOTE",
      content,
      isPinned: true,
    },
    create: {
      id: ARTIST_SHORT_VIDEO_DOCUMENT_ID,
      title,
      description: "How to prepare Reels, TikTok and Shorts without big production: short clip, drop moment, overlay and CTA.",
      type: "NOTE",
      content,
      isPinned: true,
    },
  })
}

export async function ensureArtistShortVideoTemplates(prisma: PrismaClient) {
  await Promise.all(
    checklist.map((task, index) =>
      prisma.artistTaskTemplate.upsert({
        where: { id: `short-video-template-${index + 1}` },
        update: {
          title: task.title,
          category,
          priority: task.priority,
          sortOrder: index + 1,
          isActive: true,
          description: task.description,
        },
        create: {
          id: `short-video-template-${index + 1}`,
          title: task.title,
          category,
          priority: task.priority,
          sortOrder: index + 1,
          isActive: true,
          description: task.description,
        },
      })
    )
  )
}

export async function assignArtistShortVideoTasks(prisma: PrismaClient, artistId: string) {
  await ensureArtistShortVideoDocument(prisma)

  let created = 0
  for (const [index, task] of checklist.entries()) {
    const existing = await prisma.artistTask.findFirst({
      where: {
        artistId,
        documentId: ARTIST_SHORT_VIDEO_DOCUMENT_ID,
        title: task.title,
      },
      select: { id: true },
    })

    if (existing) continue

    await prisma.artistTask.create({
      data: {
        artistId,
        documentId: ARTIST_SHORT_VIDEO_DOCUMENT_ID,
        title: task.title,
        description: task.description,
        category,
        priority: task.priority,
        status: "TODO",
        templateId: `short-video-template-${index + 1}`,
      },
    })
    created += 1
  }

  return created
}

export async function seedArtistShortVideo(prisma: PrismaClient) {
  const document = await ensureArtistShortVideoDocument(prisma)
  await ensureArtistShortVideoTemplates(prisma)

  const artists = await prisma.artist.findMany({ select: { id: true } })
  let createdTasks = 0
  for (const artist of artists) {
    createdTasks += await assignArtistShortVideoTasks(prisma, artist.id)
  }

  return { document, templates: checklist.length, artists: artists.length, createdTasks }
}
