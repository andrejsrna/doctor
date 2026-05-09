import "dotenv/config"
import { prisma } from "../lib/prisma"

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
  "Add or confirm your current artist photo",
  "Send a short artist bio",
  "Confirm all social and streaming links",
  "Send one personal quote about your next release",
  "Update your Spotify Artist Pick or profile bio",
]

async function main() {
  const document = await prisma.artistDocument.upsert({
    where: { id: "artist-onboarding-default" },
    update: {
      title,
      description: "Start here: how DnB Doctor campaigns work and what we need from you.",
      type: "NOTE",
      content,
      isPinned: true,
    },
    create: {
      id: "artist-onboarding-default",
      title,
      description: "Start here: how DnB Doctor campaigns work and what we need from you.",
      type: "NOTE",
      content,
      isPinned: true,
    },
  })

  await Promise.all(
    checklist.map((taskTitle, index) =>
      prisma.artistTaskTemplate.upsert({
        where: { id: `artist-onboarding-template-${index + 1}` },
        update: {
          title: taskTitle,
          category,
          priority: index === 0 ? "HIGH" : "NORMAL",
          sortOrder: index + 1,
          isActive: true,
          description: `Checklist item for ${title}. Assign this task to an artist when onboarding starts.`,
        },
        create: {
          id: `artist-onboarding-template-${index + 1}`,
          title: taskTitle,
          category,
          priority: index === 0 ? "HIGH" : "NORMAL",
          sortOrder: index + 1,
          isActive: true,
          description: `Checklist item for ${title}. Assign this task to an artist when onboarding starts.`,
        },
      })
    )
  )

  console.log(`Seeded ${document.title} document and ${checklist.length} onboarding task templates.`)
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
