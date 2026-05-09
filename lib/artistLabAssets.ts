import type { PrismaClient } from "@prisma/client"

export const ARTIST_ASSETS_DOCUMENT_ID = "assets-we-need-from-you-default"
const title = "Assets We Need From You"
const category = "Assets"

const content = `## Why this matters

The label can move faster when the core assets are ready before the campaign starts. You do not need a huge media kit, but we do need clean, correct and current materials.

## Press photo

- Send one current artist photo that can be used publicly.
- Use a high-resolution image if possible.
- Avoid screenshots, heavy filters, tiny crops or old photos that no longer match your project.
- If you do not have a press photo, send the best current image and tell us it is temporary.

## Short bio

- Write 3 to 5 sentences.
- Keep it current and specific.
- Mention your sound, location or project angle if useful.
- Avoid generic lines that could describe any producer.

## Logo and visual files

- Send your logo if you use one.
- Send transparent PNG or SVG if available.
- Tell us if the logo is old, unofficial or should not be used.
- Confirm the artist spelling that should appear in graphics.

## Social and streaming links

- Spotify artist link.
- Instagram.
- SoundCloud.
- YouTube or YouTube Music if relevant.
- Beatport artist page if available.
- Any link-in-bio or homepage you actively use.

## Master and release info

- Confirm final artist name and track title.
- Confirm explicit/clean status if relevant.
- Tell us if there are collaborators, vocalists or remixers.
- Confirm master version and any important notes.

## Artwork approvals

- Check spelling, title and logo usage.
- Confirm if artwork can be cropped for stories, reels or banners.
- Tell us quickly if anything is wrong before campaign assets are prepared.

## Video snippets

- Send any short DAW clips, waveform clips, studio footage, artwork loops or drop moments you already have.
- Rough clips are fine if the idea is useful.
- Label can decide what is usable, but we cannot use assets we never receive.

## Release quote

Send one short quote in your own words. It can be about what inspired the track, what moment listeners should notice, or what this release means for your project.

## Simple rule

Send assets early, keep them clear, and label anything that is temporary or not approved.`

const checklist = [
  {
    title: "Send one current press photo",
    description: "Provide one high-resolution artist photo or the best current image available for campaign use.",
    priority: "HIGH",
  },
  {
    title: "Send a short artist bio",
    description: "Write 3 to 5 current sentences about your sound, project and artist identity.",
    priority: "HIGH",
  },
  {
    title: "Send logo or confirm no logo should be used",
    description: "Provide logo files if available, preferably transparent PNG or SVG, or tell us not to use a logo.",
    priority: "NORMAL",
  },
  {
    title: "Confirm all social and streaming links",
    description: "Send Spotify, Instagram, SoundCloud, YouTube, Beatport and any active link-in-bio or homepage.",
    priority: "HIGH",
  },
  {
    title: "Confirm final master and release info",
    description: "Confirm artist name, track title, collaborator names, explicit status and master version notes.",
    priority: "HIGH",
  },
  {
    title: "Approve artwork spelling and crop usage",
    description: "Check title, artist name, logo use and whether artwork can be cropped for stories, reels or banners.",
    priority: "HIGH",
  },
  {
    title: "Send available video snippets",
    description: "Send any DAW clips, studio footage, drop moments, artwork loops or waveform clips that could support promo.",
    priority: "NORMAL",
  },
  {
    title: "Send one release quote",
    description: "Write one short quote about the track in your own words for posts, newsletter or release copy.",
    priority: "NORMAL",
  },
] as const

export async function ensureArtistAssetsDocument(prisma: PrismaClient) {
  return prisma.artistDocument.upsert({
    where: { id: ARTIST_ASSETS_DOCUMENT_ID },
    update: {
      title,
      description: "What the label needs from you before a campaign: photos, bio, links, master info, artwork approval and release quote.",
      type: "NOTE",
      content,
      isPinned: true,
    },
    create: {
      id: ARTIST_ASSETS_DOCUMENT_ID,
      title,
      description: "What the label needs from you before a campaign: photos, bio, links, master info, artwork approval and release quote.",
      type: "NOTE",
      content,
      isPinned: true,
    },
  })
}

export async function ensureArtistAssetsTemplates(prisma: PrismaClient) {
  await Promise.all(
    checklist.map((task, index) =>
      prisma.artistTaskTemplate.upsert({
        where: { id: `assets-needed-template-${index + 1}` },
        update: {
          title: task.title,
          category,
          priority: task.priority,
          sortOrder: index + 1,
          isActive: true,
          description: task.description,
        },
        create: {
          id: `assets-needed-template-${index + 1}`,
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

export async function assignArtistAssetsTasks(prisma: PrismaClient, artistId: string) {
  await ensureArtistAssetsDocument(prisma)

  let created = 0
  for (const [index, task] of checklist.entries()) {
    const existing = await prisma.artistTask.findFirst({
      where: {
        artistId,
        documentId: ARTIST_ASSETS_DOCUMENT_ID,
        title: task.title,
      },
      select: { id: true },
    })

    if (existing) continue

    await prisma.artistTask.create({
      data: {
        artistId,
        documentId: ARTIST_ASSETS_DOCUMENT_ID,
        title: task.title,
        description: task.description,
        category,
        priority: task.priority,
        status: "TODO",
        templateId: `assets-needed-template-${index + 1}`,
      },
    })
    created += 1
  }

  return created
}

export async function seedArtistAssets(prisma: PrismaClient) {
  const document = await ensureArtistAssetsDocument(prisma)
  await ensureArtistAssetsTemplates(prisma)

  const artists = await prisma.artist.findMany({ select: { id: true } })
  let createdTasks = 0
  for (const artist of artists) {
    createdTasks += await assignArtistAssetsTasks(prisma, artist.id)
  }

  return { document, templates: checklist.length, artists: artists.length, createdTasks }
}
