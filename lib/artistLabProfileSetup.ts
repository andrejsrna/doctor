import type { PrismaClient } from "@prisma/client"

export const ARTIST_PROFILE_SETUP_DOCUMENT_ID = "artist-profile-setup-default"
const title = "Artist Profile Setup"
const category = "Profile Setup"

const content = `## Why this matters

Your profiles are usually the first thing people check after hearing the track. The label can send traffic, but your profile decides whether a new listener understands who you are, follows you, or keeps moving.

## Keep your artist name consistent

- Use the same artist spelling everywhere.
- Avoid extra symbols or alternate versions unless they are part of the official name.
- Make sure the name on Spotify, Instagram, SoundCloud, Beatport and release artwork matches.
- If you changed your artist name recently, tell the label before a campaign starts.

## Spotify for Artists

- Add a current bio that sounds human and current.
- Use a clean profile image that matches your current visual direction.
- Set Artist Pick to the current release, playlist, or campaign focus.
- Check that social links point to active profiles.
- If Canvas is available for the release, send or prepare a short loop.

## Instagram

- Make the bio simple: who you are, what you make, and one useful link.
- Pin the most relevant post during release week.
- Keep highlight covers and profile image clean enough to scan quickly.
- Avoid having the latest visible posts feel unrelated to music for too long during campaign periods.

## SoundCloud

- Update the profile description and links.
- Pin or feature the track, mix, or latest important upload if available.
- Make sure old broken links are removed.
- Keep artwork, banner and avatar reasonably aligned with your current project.

## Beatport and store profiles

- Check that your artist page points to the right releases.
- Tell the label if there are duplicate artist pages or wrong releases attached to your name.
- Keep your public artist name consistent so stores and DJs can find you.

## Visual basics

- Use one current artist photo or visual direction across key profiles.
- Do not change profile images every few days during a campaign.
- Keep banners readable on mobile.
- Use visuals that match the tone of the music and current release.

## Simple rule

Every profile should answer three questions in seconds: who are you, what do you sound like, and where should the listener go next.`

const checklist = [
  {
    title: "Check artist name consistency across platforms",
    description: "Confirm your artist name is written the same way on Spotify, Instagram, SoundCloud, Beatport and current release assets.",
    priority: "HIGH",
  },
  {
    title: "Update Spotify bio, photo and Artist Pick",
    description: "Make Spotify look current: bio, profile image, social links and Artist Pick should support the active campaign.",
    priority: "HIGH",
  },
  {
    title: "Clean up Instagram bio link and pinned posts",
    description: "Use one clear bio link and pin the post that best supports the current release or artist story.",
    priority: "NORMAL",
  },
  {
    title: "Review SoundCloud description, links and featured content",
    description: "Remove dead links, update the profile text and feature the most relevant track or mix if possible.",
    priority: "NORMAL",
  },
  {
    title: "Report duplicate or wrong Beatport artist pages",
    description: "Check whether Beatport and stores attach releases to the correct artist page. Tell the label if anything is wrong.",
    priority: "NORMAL",
  },
  {
    title: "Confirm current profile images and banners",
    description: "Make sure profile photos and banners are current, readable on mobile and aligned with the release visual direction.",
    priority: "NORMAL",
  },
] as const

export async function ensureArtistProfileSetupDocument(prisma: PrismaClient) {
  return prisma.artistDocument.upsert({
    where: { id: ARTIST_PROFILE_SETUP_DOCUMENT_ID },
    update: {
      title,
      description: "Clean up Spotify, Instagram, SoundCloud, Beatport and visuals before campaigns send traffic.",
      type: "NOTE",
      content,
      isPinned: true,
    },
    create: {
      id: ARTIST_PROFILE_SETUP_DOCUMENT_ID,
      title,
      description: "Clean up Spotify, Instagram, SoundCloud, Beatport and visuals before campaigns send traffic.",
      type: "NOTE",
      content,
      isPinned: true,
    },
  })
}

export async function ensureArtistProfileSetupTemplates(prisma: PrismaClient) {
  await Promise.all(
    checklist.map((task, index) =>
      prisma.artistTaskTemplate.upsert({
        where: { id: `artist-profile-setup-template-${index + 1}` },
        update: {
          title: task.title,
          category,
          priority: task.priority,
          sortOrder: index + 1,
          isActive: true,
          description: task.description,
        },
        create: {
          id: `artist-profile-setup-template-${index + 1}`,
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

export async function assignArtistProfileSetupTasks(prisma: PrismaClient, artistId: string) {
  await ensureArtistProfileSetupDocument(prisma)

  let created = 0
  for (const [index, task] of checklist.entries()) {
    const existing = await prisma.artistTask.findFirst({
      where: {
        artistId,
        documentId: ARTIST_PROFILE_SETUP_DOCUMENT_ID,
        title: task.title,
      },
      select: { id: true },
    })

    if (existing) continue

    await prisma.artistTask.create({
      data: {
        artistId,
        documentId: ARTIST_PROFILE_SETUP_DOCUMENT_ID,
        title: task.title,
        description: task.description,
        category,
        priority: task.priority,
        status: "TODO",
        templateId: `artist-profile-setup-template-${index + 1}`,
      },
    })
    created += 1
  }

  return created
}

export async function seedArtistProfileSetup(prisma: PrismaClient) {
  const document = await ensureArtistProfileSetupDocument(prisma)
  await ensureArtistProfileSetupTemplates(prisma)

  const artists = await prisma.artist.findMany({ select: { id: true } })
  let createdTasks = 0
  for (const artist of artists) {
    createdTasks += await assignArtistProfileSetupTasks(prisma, artist.id)
  }

  return { document, templates: checklist.length, artists: artists.length, createdTasks }
}
