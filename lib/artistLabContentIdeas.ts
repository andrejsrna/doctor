import type { PrismaClient } from "@prisma/client"

export const ARTIST_CONTENT_IDEAS_DOCUMENT_ID = "content-ideas-for-producers-default"
const title = "Content Ideas For Producers"
const category = "Content Ideas"

const content = `## Why this matters

You do not need to become a full-time content creator to support a release. The best producer content usually comes from small real moments: a screen recording, a bass before and after, a studio photo, or a short story about how the track started.

## Keep it simple

- One idea is enough for one post.
- Short clips are better than overproduced edits.
- Show the sound, the project, the process, or the feeling.
- Do not wait for perfect lighting or a perfect studio.
- If you are introverted, you can post without talking to camera.

## Easy post formats

- Screen recording from your DAW while the drop plays.
- Bass sound before and after processing.
- Drum loop alone, then the full drop.
- Project screenshot with a short caption.
- Studio photo with one sentence about the track.
- Artwork crop with the release date.
- Short video of the waveform or visualizer.
- Voice note or text caption: how this track started.

## Before and after ideas

- Raw bass versus final bass.
- Dry drums versus processed drums.
- First idea versus final drop.
- No master versus mastered preview.
- Old project name versus final title.

## Captions that work

- Keep captions specific.
- Mention one detail listeners can notice.
- Say what the track felt like to make.
- Ask a simple question only if you actually want answers.
- Avoid generic lines like “out now everywhere” as the only message.

## For introverted producers

- Use text overlays instead of talking.
- Record your screen instead of your face.
- Post hands-on gear, DAW clips, artwork details or short notes.
- Batch 3 clips in one session so you do not need to think every day.

## Simple rule

Content does not need to prove you are a marketer. It should prove there is a real person and a real process behind the track.`

const checklist = [
  {
    title: "Record one DAW screen clip",
    description: "Capture 10 to 20 seconds from your project while an interesting part of the track plays. No face or talking required.",
    priority: "HIGH",
  },
  {
    title: "Prepare one bass before and after clip",
    description: "Show a raw bass or synth sound, then the processed version. Keep it short and easy to understand.",
    priority: "NORMAL",
  },
  {
    title: "Take one studio or setup photo",
    description: "Use a simple photo of your desk, headphones, controller, speakers, notes or project screen with one honest caption.",
    priority: "NORMAL",
  },
  {
    title: "Write a short how this track started caption",
    description: "Explain the first idea behind the track in 1 to 3 sentences. Keep it specific and personal.",
    priority: "NORMAL",
  },
  {
    title: "Create one drop teaser clip",
    description: "Export a short drop moment, waveform video, artwork loop or screen recording that can be posted as a story or reel.",
    priority: "HIGH",
  },
  {
    title: "Prepare one text overlay for a quiet post",
    description: "Write a simple overlay like 'raw bass to final drop' or 'this started as a 2am loop' for a clip that does not need voiceover.",
    priority: "LOW",
  },
  {
    title: "Save three content ideas for the next release",
    description: "Write down three quick ideas you can reuse: process clip, sound design moment, studio detail, artwork detail or release story.",
    priority: "LOW",
  },
] as const

export async function ensureArtistContentIdeasDocument(prisma: PrismaClient) {
  return prisma.artistDocument.upsert({
    where: { id: ARTIST_CONTENT_IDEAS_DOCUMENT_ID },
    update: {
      title,
      description: "Simple post ideas for producers who want useful content without becoming full-time creators.",
      type: "NOTE",
      content,
      isPinned: true,
    },
    create: {
      id: ARTIST_CONTENT_IDEAS_DOCUMENT_ID,
      title,
      description: "Simple post ideas for producers who want useful content without becoming full-time creators.",
      type: "NOTE",
      content,
      isPinned: true,
    },
  })
}

export async function ensureArtistContentIdeasTemplates(prisma: PrismaClient) {
  await Promise.all(
    checklist.map((task, index) =>
      prisma.artistTaskTemplate.upsert({
        where: { id: `content-ideas-template-${index + 1}` },
        update: {
          title: task.title,
          category,
          priority: task.priority,
          sortOrder: index + 1,
          isActive: true,
          description: task.description,
        },
        create: {
          id: `content-ideas-template-${index + 1}`,
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

export async function assignArtistContentIdeasTasks(prisma: PrismaClient, artistId: string) {
  await ensureArtistContentIdeasDocument(prisma)

  let created = 0
  for (const [index, task] of checklist.entries()) {
    const existing = await prisma.artistTask.findFirst({
      where: {
        artistId,
        documentId: ARTIST_CONTENT_IDEAS_DOCUMENT_ID,
        title: task.title,
      },
      select: { id: true },
    })

    if (existing) continue

    await prisma.artistTask.create({
      data: {
        artistId,
        documentId: ARTIST_CONTENT_IDEAS_DOCUMENT_ID,
        title: task.title,
        description: task.description,
        category,
        priority: task.priority,
        status: "TODO",
        templateId: `content-ideas-template-${index + 1}`,
      },
    })
    created += 1
  }

  return created
}

export async function seedArtistContentIdeas(prisma: PrismaClient) {
  const document = await ensureArtistContentIdeasDocument(prisma)
  await ensureArtistContentIdeasTemplates(prisma)

  const artists = await prisma.artist.findMany({ select: { id: true } })
  let createdTasks = 0
  for (const artist of artists) {
    createdTasks += await assignArtistContentIdeasTasks(prisma, artist.id)
  }

  return { document, templates: checklist.length, artists: artists.length, createdTasks }
}
