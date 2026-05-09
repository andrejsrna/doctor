import type { PrismaClient } from "@prisma/client"

export const ARTIST_MONTHLY_ROUTINE_DOCUMENT_ID = "monthly-artist-growth-routine-default"
const title = "Monthly Artist Growth Routine"
const category = "Monthly Routine"

const content = `## What this is for

Growth is easier when it becomes a small monthly rhythm instead of a huge push only on release day. This routine is light on purpose: a few posts, one profile update, one real connection, and a quick look at what worked.

## Monthly target

- 2 short videos.
- 2 stories.
- 1 profile update.
- 1 networking message.
- 1 quick stats check.

## 2 short videos

Keep them simple. Use DAW screen recordings, waveform clips, artwork loops, bass before and after moments, or quick studio details. The goal is not to go viral every time. The goal is to stay visible and keep improving.

## 2 stories

Stories can be small updates: studio photo, repost, work in progress, release reminder, track you are listening to, or a quick thought. It does not need to be perfect.

## 1 profile update

Check one public profile each month. Update bio, link, pinned post, Artist Pick, SoundCloud description, or profile image if needed. Small maintenance prevents profiles from looking abandoned.

## 1 networking message

Send one real message to another producer, DJ, page, promoter, or supporter. Do not ask for something immediately. Start or maintain a real connection.

## Stats check

Look at what happened this month. Which post got saves? Which clip got replies? Which platform moved? What felt easy enough to repeat?

## Simple rule

If the routine feels too heavy, make it smaller but keep it consistent. Consistency beats occasional big bursts.`

const checklist = [
  {
    title: "Post two short videos this month",
    description: "Publish two simple clips: DAW screen recording, waveform, artwork loop, studio detail, bass before/after or drop teaser.",
    priority: "HIGH",
  },
  {
    title: "Share two lightweight stories",
    description: "Post two stories during the month: studio update, repost, work in progress, release reminder or personal music note.",
    priority: "NORMAL",
  },
  {
    title: "Update one public profile",
    description: "Refresh one profile item: bio, link, pinned post, Spotify Artist Pick, SoundCloud description or profile image.",
    priority: "NORMAL",
  },
  {
    title: "Send one real networking message",
    description: "Message one producer, DJ, supporter or page in a natural way. Start a connection, do not spam a link.",
    priority: "NORMAL",
  },
  {
    title: "Check monthly stats",
    description: "Look at saves, comments, replies, clicks or plays and write down one thing that worked.",
    priority: "NORMAL",
  },
  {
    title: "Save one repeatable content idea",
    description: "Pick one format that felt easy enough to repeat next month.",
    priority: "LOW",
  },
] as const

export async function ensureArtistMonthlyRoutineDocument(prisma: PrismaClient) {
  return prisma.artistDocument.upsert({
    where: { id: ARTIST_MONTHLY_ROUTINE_DOCUMENT_ID },
    update: {
      title,
      description: "A light monthly rhythm: two short videos, two stories, one profile update, one real connection and one stats check.",
      type: "NOTE",
      content,
      isPinned: true,
    },
    create: {
      id: ARTIST_MONTHLY_ROUTINE_DOCUMENT_ID,
      title,
      description: "A light monthly rhythm: two short videos, two stories, one profile update, one real connection and one stats check.",
      type: "NOTE",
      content,
      isPinned: true,
    },
  })
}

export async function ensureArtistMonthlyRoutineTemplates(prisma: PrismaClient) {
  await Promise.all(
    checklist.map((task, index) =>
      prisma.artistTaskTemplate.upsert({
        where: { id: `monthly-routine-template-${index + 1}` },
        update: {
          title: task.title,
          category,
          priority: task.priority,
          sortOrder: index + 1,
          isActive: true,
          description: task.description,
        },
        create: {
          id: `monthly-routine-template-${index + 1}`,
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

export async function assignArtistMonthlyRoutineTasks(prisma: PrismaClient, artistId: string) {
  await ensureArtistMonthlyRoutineDocument(prisma)

  let created = 0
  for (const [index, task] of checklist.entries()) {
    const existing = await prisma.artistTask.findFirst({
      where: {
        artistId,
        documentId: ARTIST_MONTHLY_ROUTINE_DOCUMENT_ID,
        title: task.title,
      },
      select: { id: true },
    })

    if (existing) continue

    await prisma.artistTask.create({
      data: {
        artistId,
        documentId: ARTIST_MONTHLY_ROUTINE_DOCUMENT_ID,
        title: task.title,
        description: task.description,
        category,
        priority: task.priority,
        status: "TODO",
        templateId: `monthly-routine-template-${index + 1}`,
      },
    })
    created += 1
  }

  return created
}

export async function seedArtistMonthlyRoutine(prisma: PrismaClient) {
  const document = await ensureArtistMonthlyRoutineDocument(prisma)
  await ensureArtistMonthlyRoutineTemplates(prisma)

  const artists = await prisma.artist.findMany({ select: { id: true } })
  let createdTasks = 0
  for (const artist of artists) {
    createdTasks += await assignArtistMonthlyRoutineTasks(prisma, artist.id)
  }

  return { document, templates: checklist.length, artists: artists.length, createdTasks }
}
