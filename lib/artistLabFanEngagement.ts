import type { PrismaClient } from "@prisma/client"

export const ARTIST_FAN_ENGAGEMENT_DOCUMENT_ID = "fan-engagement-basics-default"
const title = "Fan Engagement Basics"
const category = "Fan Engagement"

const content = `## What this is for

Fan engagement is not about acting bigger than you are. It is about noticing the people who already care: comments, story tags, small messages, DJ support, reposts and friends sharing your music.

Small audiences can become strong audiences when people feel seen.

## Reply to comments

If somebody comments on your post, reply like a human. A short thank you, a real answer, or a simple follow-up question is enough. Do not overthink it and do not force a fake brand voice.

## Thank people for support

When somebody shares your track, plays it, writes about it, comments, or messages you about it, thank them. This can be public or private. The point is to acknowledge support while it is fresh.

## Repost stories

Repost stories where people tag you, your track, the label, a DJ set, a radio play, or a download. Add a short personal line instead of only reposting silently.

## Work with a small audience

A small audience is not a problem. It is easier to build real trust when you can still answer people directly. Treat every real listener like they matter, because early supporters often become the strongest ones.

## Keep it natural

Do not reply with copy-paste hype. Do not message people only when you need something. Keep the tone simple, thankful and direct.

## Easy examples

- "Thank you for checking it out, really appreciate it."
- "Glad this one landed with you."
- "Thanks for sharing this, means a lot."
- "Appreciate the support, more music soon."
- "Big up for playing it."

## Simple rule

Every week, notice the people who interacted with your music and answer a few of them properly. Real attention beats fake engagement tricks.`

const checklist = [
  {
    title: "Reply to recent comments",
    description: "Answer recent comments on Instagram, TikTok, SoundCloud, YouTube or other active profiles in a simple human tone.",
    priority: "HIGH",
  },
  {
    title: "Thank people who shared or supported you",
    description: "Send a quick thank you to people who shared your track, played it, commented, messaged you or supported the release.",
    priority: "HIGH",
  },
  {
    title: "Repost tagged stories",
    description: "Repost relevant stories where people tag you, your music, a DJ set, a radio play or the label. Add one short personal line.",
    priority: "NORMAL",
  },
  {
    title: "Answer one DM properly",
    description: "Pick one real message from a listener, DJ, producer or supporter and answer it like a person, not like a promo account.",
    priority: "NORMAL",
  },
  {
    title: "Save useful fan reactions",
    description: "Screenshot or save good comments, story mentions or feedback that could be useful later for release proof, posts or motivation.",
    priority: "NORMAL",
  },
  {
    title: "Avoid copy-paste replies",
    description: "Check your recent replies and remove the habit of using the same generic hype line everywhere.",
    priority: "LOW",
  },
  {
    title: "Notice one early supporter",
    description: "Give attention to one smaller supporter, DJ, page or listener who consistently reacts to your music.",
    priority: "LOW",
  },
] as const

export async function ensureArtistFanEngagementDocument(prisma: PrismaClient) {
  return prisma.artistDocument.upsert({
    where: { id: ARTIST_FAN_ENGAGEMENT_DOCUMENT_ID },
    update: {
      title,
      description: "How to reply to comments, thank supporters, repost stories and build real connection with a small audience.",
      type: "NOTE",
      content,
      isPinned: true,
    },
    create: {
      id: ARTIST_FAN_ENGAGEMENT_DOCUMENT_ID,
      title,
      description: "How to reply to comments, thank supporters, repost stories and build real connection with a small audience.",
      type: "NOTE",
      content,
      isPinned: true,
    },
  })
}

export async function ensureArtistFanEngagementTemplates(prisma: PrismaClient) {
  await Promise.all(
    checklist.map((task, index) =>
      prisma.artistTaskTemplate.upsert({
        where: { id: `fan-engagement-template-${index + 1}` },
        update: {
          title: task.title,
          category,
          priority: task.priority,
          sortOrder: index + 1,
          isActive: true,
          description: task.description,
        },
        create: {
          id: `fan-engagement-template-${index + 1}`,
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

export async function assignArtistFanEngagementTasks(prisma: PrismaClient, artistId: string) {
  await ensureArtistFanEngagementDocument(prisma)

  let created = 0
  for (const [index, task] of checklist.entries()) {
    const existing = await prisma.artistTask.findFirst({
      where: {
        artistId,
        documentId: ARTIST_FAN_ENGAGEMENT_DOCUMENT_ID,
        title: task.title,
      },
      select: { id: true },
    })

    if (existing) continue

    await prisma.artistTask.create({
      data: {
        artistId,
        documentId: ARTIST_FAN_ENGAGEMENT_DOCUMENT_ID,
        title: task.title,
        description: task.description,
        category,
        priority: task.priority,
        status: "TODO",
        templateId: `fan-engagement-template-${index + 1}`,
      },
    })
    created += 1
  }

  return created
}

export async function seedArtistFanEngagement(prisma: PrismaClient) {
  const document = await ensureArtistFanEngagementDocument(prisma)
  await ensureArtistFanEngagementTemplates(prisma)

  const artists = await prisma.artist.findMany({ select: { id: true } })
  let createdTasks = 0
  for (const artist of artists) {
    createdTasks += await assignArtistFanEngagementTasks(prisma, artist.id)
  }

  return { document, templates: checklist.length, artists: artists.length, createdTasks }
}
