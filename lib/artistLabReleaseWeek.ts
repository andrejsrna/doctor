import type { PrismaClient } from "@prisma/client"

export const ARTIST_RELEASE_WEEK_DOCUMENT_ID = "release-week-action-plan-default"
const title = "Release Week Action Plan"
const category = "Release Week"

const content = `## What this plan is for

Release week is when the label campaign and your personal artist signal should hit at the same time. The label handles distribution, pitching, release pages, newsletter and main promo. Your job is to make the release feel alive from the artist side.

## 7 days before release

- Prepare one short teaser story or reel.
- Make sure your profile link can point to the release, pre-save, label page or current campaign link.
- Save the release date and posting times in your calendar.
- Check that your artist name, tags and handles are correct in the campaign assets.
- Prepare one personal sentence about why the track matters.

## 2 to 3 days before release

- Share a light teaser without overexplaining the track.
- Mention the release date clearly.
- Tag DnB Doctor and any collaborators correctly.
- Ask close supporters to keep an eye on the release instead of spamming them with links.

## Release day

- Share the official label post to your story.
- Publish one personal post or reel in your own voice.
- Add the release link to your bio or link-in-bio page.
- Reply to comments and DMs during the first day.
- Repost stories from people who support the track.

## 48 hours after release

- Keep replying to comments and reposting support.
- Share one second angle: studio detail, artwork detail, drop clip, or short note about the tune.
- Thank people who shared the release.
- Send the label any useful screenshots or reactions.

## 7 days after release

- Post one follow-up reminder for people who missed release day.
- Share a playlist, clip, DJ support, comment, or personal reflection if available.
- Check what performed best and tell the label what you noticed.

## Avoid this

- Do not post only once and disappear.
- Do not copy-paste generic promo text if it does not sound like you.
- Do not tag random pages repeatedly.
- Do not argue in comments or over-explain negative reactions.
- Do not change bio links before the first campaign window is finished.

## Simple rule

Your release week job is not to become a marketing machine. It is to show up clearly, personally and repeatedly enough that people can see the release matters to you.`

const checklist = [
  {
    title: "Prepare one short teaser before release week",
    description: "Create a simple 10 to 20 second story, reel, waveform, studio clip, artwork motion, or drop moment before release week starts.",
    priority: "HIGH",
  },
  {
    title: "Confirm release date, tags and campaign link",
    description: "Check the release date, DnB Doctor tags, collaborator tags and the link you will use in bio or stories.",
    priority: "HIGH",
  },
  {
    title: "Write one personal release-day caption",
    description: "Prepare a short caption in your own voice explaining what the track is, why it matters, or what moment listeners should notice.",
    priority: "NORMAL",
  },
  {
    title: "Share the official label post on release day",
    description: "Repost the official DnB Doctor post to your story and add a short personal line, not just a silent repost.",
    priority: "HIGH",
  },
  {
    title: "Update bio or link-in-bio for release day",
    description: "Point your active profile link to the release, campaign page, or main listening link during the release window.",
    priority: "NORMAL",
  },
  {
    title: "Reply to comments and DMs for the first 48 hours",
    description: "Keep the post alive by answering comments, thanking people and responding to genuine messages after release.",
    priority: "NORMAL",
  },
  {
    title: "Repost listener and supporter stories",
    description: "Repost relevant stories from fans, DJs, friends, collaborators or the label when they support the track.",
    priority: "NORMAL",
  },
  {
    title: "Post one follow-up within 7 days",
    description: "Share a second angle after release day: clip, feedback, studio detail, quote, artwork detail, or short reminder.",
    priority: "NORMAL",
  },
] as const

export async function ensureArtistReleaseWeekDocument(prisma: PrismaClient) {
  return prisma.artistDocument.upsert({
    where: { id: ARTIST_RELEASE_WEEK_DOCUMENT_ID },
    update: {
      title,
      description: "What to do 7 days before release, on release day and 7 days after without taking over label promo work.",
      type: "NOTE",
      content,
      isPinned: true,
    },
    create: {
      id: ARTIST_RELEASE_WEEK_DOCUMENT_ID,
      title,
      description: "What to do 7 days before release, on release day and 7 days after without taking over label promo work.",
      type: "NOTE",
      content,
      isPinned: true,
    },
  })
}

export async function ensureArtistReleaseWeekTemplates(prisma: PrismaClient) {
  await Promise.all(
    checklist.map((task, index) =>
      prisma.artistTaskTemplate.upsert({
        where: { id: `release-week-template-${index + 1}` },
        update: {
          title: task.title,
          category,
          priority: task.priority,
          sortOrder: index + 1,
          isActive: true,
          description: task.description,
        },
        create: {
          id: `release-week-template-${index + 1}`,
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

export async function assignArtistReleaseWeekTasks(prisma: PrismaClient, artistId: string) {
  await ensureArtistReleaseWeekDocument(prisma)

  let created = 0
  for (const [index, task] of checklist.entries()) {
    const existing = await prisma.artistTask.findFirst({
      where: {
        artistId,
        documentId: ARTIST_RELEASE_WEEK_DOCUMENT_ID,
        title: task.title,
      },
      select: { id: true },
    })

    if (existing) continue

    await prisma.artistTask.create({
      data: {
        artistId,
        documentId: ARTIST_RELEASE_WEEK_DOCUMENT_ID,
        title: task.title,
        description: task.description,
        category,
        priority: task.priority,
        status: "TODO",
        templateId: `release-week-template-${index + 1}`,
      },
    })
    created += 1
  }

  return created
}

export async function seedArtistReleaseWeek(prisma: PrismaClient) {
  const document = await ensureArtistReleaseWeekDocument(prisma)
  await ensureArtistReleaseWeekTemplates(prisma)

  const artists = await prisma.artist.findMany({ select: { id: true } })
  let createdTasks = 0
  for (const artist of artists) {
    createdTasks += await assignArtistReleaseWeekTasks(prisma, artist.id)
  }

  return { document, templates: checklist.length, artists: artists.length, createdTasks }
}
