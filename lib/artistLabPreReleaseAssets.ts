import type { PrismaClient } from "@prisma/client"

export const ARTIST_PRE_RELEASE_ASSET_TEMPLATE_ID = "pre-release-asset-checklist-template"
const title = "Pre-Release Asset Checklist"
const category = "Pre-Release Assets"

const content = `## What this is for

Use this before every release when the label needs final assets, links and clean public information from you. This is not a daily growth task. It is a release-prep checklist.

## Links

Send or confirm all important links: Spotify artist profile, Instagram, SoundCloud, Beatport, YouTube, Bandcamp, Linktree or your main link hub. Make sure the names and handles are current.

## Bio and press photo

Keep a short bio ready and send a current press photo. If you have a new artist photo, make sure it matches the visual direction of the release.

## Teaser assets

Prepare a short teaser clip, artwork loop, DAW screen recording, drop moment or simple vertical video that can be used around release week.

## Artist quote

Write one short quote about the track. Keep it human: what inspired it, what the energy is, why it matters, or where it fits in your sound.

## Social handles

Check that your social handles are correct before the campaign starts. Wrong tags waste attention and make reposts harder.

## Tags and credits

Confirm producer name, collaborators, remixers, vocalists, label tag, release title spelling, artwork credit and any important metadata before we publish campaign content.

## Simple rule

Before the release campaign starts, label and artist should have the same clean package: links, photo, bio, teaser, quote, handles and tags.`

const checklist = [
  {
    title: "Confirm main artist links",
    description: "Send or confirm Spotify, Instagram, SoundCloud, Beatport, YouTube, Bandcamp or your main link hub.",
    priority: "HIGH",
  },
  {
    title: "Send current short bio",
    description: "Provide a short artist bio that can be used in release copy, posts or press context.",
    priority: "HIGH",
  },
  {
    title: "Send press photo",
    description: "Upload or send a current press photo that fits your artist image and can be used by the label.",
    priority: "HIGH",
  },
  {
    title: "Prepare one teaser asset",
    description: "Create one simple teaser: vertical drop clip, artwork loop, DAW recording, studio video or waveform visual.",
    priority: "HIGH",
  },
  {
    title: "Write a short release quote",
    description: "Send one natural quote about the track, the idea, the sound or why this release matters to you.",
    priority: "NORMAL",
  },
  {
    title: "Confirm social handles",
    description: "Check Instagram, TikTok, SoundCloud and other handles so the label tags the right accounts.",
    priority: "NORMAL",
  },
  {
    title: "Confirm tags and credits",
    description: "Confirm artist name spelling, title spelling, collaborators, remixers, vocalists, label tag and artwork credit.",
    priority: "NORMAL",
  },
  {
    title: "Approve final artwork and metadata",
    description: "Check the final artwork, release title, artist name, track title and any visible credits before campaign posts go out.",
    priority: "NORMAL",
  },
] as const

export async function ensureArtistPreReleaseAssetTemplate(prisma: PrismaClient) {
  return prisma.artistDocument.upsert({
    where: { id: ARTIST_PRE_RELEASE_ASSET_TEMPLATE_ID },
    update: {
      artistId: null,
      title,
      description: "Manual template for release prep: links, bio, photo, teaser, quote, handles, tags and approvals.",
      type: "NOTE",
      content,
      isPinned: false,
      isTemplate: true,
    },
    create: {
      id: ARTIST_PRE_RELEASE_ASSET_TEMPLATE_ID,
      artistId: null,
      title,
      description: "Manual template for release prep: links, bio, photo, teaser, quote, handles, tags and approvals.",
      type: "NOTE",
      content,
      isPinned: false,
      isTemplate: true,
    },
  })
}

export async function ensureArtistPreReleaseAssetTaskTemplates(prisma: PrismaClient) {
  await Promise.all(
    checklist.map((task, index) =>
      prisma.artistTaskTemplate.upsert({
        where: { id: `pre-release-assets-template-${index + 1}` },
        update: {
          title: task.title,
          category,
          priority: task.priority,
          sortOrder: index + 1,
          isActive: true,
          description: task.description,
        },
        create: {
          id: `pre-release-assets-template-${index + 1}`,
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

export async function assignArtistPreReleaseAssetChecklist(prisma: PrismaClient, artistId: string) {
  const template = await ensureArtistPreReleaseAssetTemplate(prisma)
  await ensureArtistPreReleaseAssetTaskTemplates(prisma)

  const document = await prisma.artistDocument.create({
    data: {
      artistId,
      title: template.title,
      description: template.description,
      type: template.type,
      url: template.url,
      content: template.content,
      isPinned: true,
      isTemplate: false,
    },
  })

  await prisma.artistTask.createMany({
    data: checklist.map((task, index) => ({
      artistId,
      documentId: document.id,
      templateId: `pre-release-assets-template-${index + 1}`,
      title: task.title,
      description: task.description,
      category,
      priority: task.priority,
      status: "TODO",
    })),
  })

  return { document, tasks: checklist.length }
}

export async function seedArtistPreReleaseAssetTemplate(prisma: PrismaClient) {
  const document = await ensureArtistPreReleaseAssetTemplate(prisma)
  await ensureArtistPreReleaseAssetTaskTemplates(prisma)

  return { document, templates: checklist.length }
}
