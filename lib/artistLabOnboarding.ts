import type { PrismaClient } from "@prisma/client"

export const ARTIST_ONBOARDING_DOCUMENT_ID = "artist-onboarding-default"
const title = "Artist Onboarding"
const category = "Onboarding"

const content = `## Welcome to DnB Doctor

This workspace is here to keep releases organized and make your growth work clear. The label handles distribution, campaign structure, pitching, release pages and the main promo push. Your job is to give the release a real human signal from the artist side.

## How we work

- Keep your artist profile clean and current.
- Deliver assets before deadlines so the release campaign has enough time.
- Share official posts in your own voice, not as copy-paste spam.
- Reply to comments, repost support and keep the conversation alive.
- Use the checklist in this workspace as your source of truth.

## What the label needs from you

- Current artist photo or press image.
- Short artist bio, around 3 to 5 sentences.
- Spotify, Instagram, SoundCloud, YouTube and other relevant links.
- One short quote about the release in your own words.
- Any short video clips or studio footage you already have.
- Confirmation that track title, artist name and artwork are correct.

## What you should update before a campaign

- Spotify for Artists bio and Artist Pick.
- Instagram bio link or pinned release post.
- SoundCloud profile description and links.
- Link-in-bio page if you use one.
- Profile picture if it no longer matches the current project.

## Release communication

Keep it personal. Tell people why the track matters, how it started, what moment in the tune you like, or what it means for your project. A short honest post works better than generic promo language.

## Avoid this

- Do not send mass spam to random curators.
- Do not change artwork, title or release copy after campaign assets are prepared unless it is critical.
- Do not wait until release day to send your profile links or assets.
- Do not post only once and disappear.

## Simple rule

The label creates the campaign. You create the artist signal around it. When both happen at the same time, the release has a much better chance to move.`

const checklist = [
  {
    title: "Add or confirm your current artist photo",
    description: "Upload or send one current press image that can be used across release pages, posts and campaign assets.",
    priority: "HIGH",
  },
  {
    title: "Send a short artist bio",
    description: "Write 3 to 5 sentences in your own voice. Keep it current and focused on the project you are releasing now.",
    priority: "NORMAL",
  },
  {
    title: "Confirm all social and streaming links",
    description: "Check Spotify, Instagram, SoundCloud, YouTube and other relevant links so the label can route people correctly.",
    priority: "NORMAL",
  },
  {
    title: "Send one personal quote about your next release",
    description: "Give us one short quote about the track: where it started, what it means, or what moment listeners should notice.",
    priority: "NORMAL",
  },
  {
    title: "Update your Spotify Artist Pick or profile bio",
    description: "Make sure your public profile points to the current campaign and does not look abandoned.",
    priority: "NORMAL",
  },
] as const

export async function ensureArtistOnboardingDocument(prisma: PrismaClient) {
  return prisma.artistDocument.upsert({
    where: { id: ARTIST_ONBOARDING_DOCUMENT_ID },
    update: {
      title,
      description: "Start here: how DnB Doctor campaigns work and what we need from you.",
      type: "NOTE",
      content,
      isPinned: true,
    },
    create: {
      id: ARTIST_ONBOARDING_DOCUMENT_ID,
      title,
      description: "Start here: how DnB Doctor campaigns work and what we need from you.",
      type: "NOTE",
      content,
      isPinned: true,
    },
  })
}

export async function ensureArtistOnboardingTemplates(prisma: PrismaClient) {
  await Promise.all(
    checklist.map((task, index) =>
      prisma.artistTaskTemplate.upsert({
        where: { id: `artist-onboarding-template-${index + 1}` },
        update: {
          title: task.title,
          category,
          priority: task.priority,
          sortOrder: index + 1,
          isActive: true,
          description: task.description,
        },
        create: {
          id: `artist-onboarding-template-${index + 1}`,
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

export async function assignArtistOnboardingTasks(prisma: PrismaClient, artistId: string) {
  await ensureArtistOnboardingDocument(prisma)

  let created = 0
  for (const [index, task] of checklist.entries()) {
    const existing = await prisma.artistTask.findFirst({
      where: {
        artistId,
        documentId: ARTIST_ONBOARDING_DOCUMENT_ID,
        title: task.title,
      },
      select: { id: true },
    })

    if (existing) continue

    await prisma.artistTask.create({
      data: {
        artistId,
        documentId: ARTIST_ONBOARDING_DOCUMENT_ID,
        title: task.title,
        description: task.description,
        category,
        priority: task.priority,
        status: "TODO",
        templateId: `artist-onboarding-template-${index + 1}`,
      },
    })
    created += 1
  }

  return created
}

export async function seedArtistOnboarding(prisma: PrismaClient) {
  const document = await ensureArtistOnboardingDocument(prisma)
  await ensureArtistOnboardingTemplates(prisma)

  const artists = await prisma.artist.findMany({ select: { id: true } })
  let createdTasks = 0
  for (const artist of artists) {
    createdTasks += await assignArtistOnboardingTasks(prisma, artist.id)
  }

  return { document, templates: checklist.length, artists: artists.length, createdTasks }
}
