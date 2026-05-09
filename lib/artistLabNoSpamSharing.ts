import type { PrismaClient } from "@prisma/client"

export const ARTIST_NO_SPAM_SHARING_DOCUMENT_ID = "how-to-share-without-spamming-default"
const title = "How To Share Your Release Without Spamming"
const category = "Release Sharing"

const content = `## What this is for

Sharing your release does not mean blasting the same link to random people. The best artist-side sharing feels human: “hey, I released something I care about, thought you might like it.”

## Who to message

- Friends who genuinely follow your music.
- DJs who already play your sound.
- Producers you actually talk to.
- Small pages or communities that know your style.
- People who supported your earlier tracks.

## Who not to message

- Random playlist curators you do not know.
- Big pages with unrelated sound.
- People you only contact when you need something.
- Everyone in your inbox with the same copy-paste text.

## Message like a person

- Use their name if you know it.
- Keep it short.
- Say why you thought of them.
- Mention one specific thing about the track.
- Make it easy to ignore without pressure.

## Good message examples

- Hey, I just released a new DnB Doctor track. Thought you might like the second drop because it leans into the darker bass stuff we talked about.
- New one is out today. No pressure, but if you need fresh neurofunk for a set, this might fit.
- Just wanted to share this with you before the weekend. It started as a rough bass loop and turned into my next DnB Doctor release.

## Sharing to DJs

- Do not demand support.
- Mention BPM or vibe if it helps.
- Send one clean link.
- If they play it, thank them and repost.
- If they do not answer, leave it.

## Sharing to fans and friends

- Make it personal.
- Tell them what the track means to you.
- Ask for a listen, save, comment or share only if it feels natural.
- Thank people who actually support.

## Simple rule

If the message would feel annoying to receive, do not send it. If it feels like a real note from a real person, it is probably fine.`

const checklist = [
  {
    title: "Make a short list of real supporters",
    description: "Write down 5 to 10 people who genuinely know your music: friends, DJs, producers, fans or small pages.",
    priority: "HIGH",
  },
  {
    title: "Write one natural message template",
    description: "Prepare a short message that sounds like you. Avoid generic copy-paste promo language.",
    priority: "HIGH",
  },
  {
    title: "Personalize three messages before sending",
    description: "Add one specific reason why each person might care about the track before you send the link.",
    priority: "NORMAL",
  },
  {
    title: "Send one clean release link",
    description: "Use one clear release, label, smartlink or streaming URL instead of sending multiple confusing links.",
    priority: "NORMAL",
  },
  {
    title: "Share the release with no pressure wording",
    description: "Use language like 'no pressure' or 'thought you might like this' instead of asking directly for support.",
    priority: "NORMAL",
  },
  {
    title: "Thank people who respond or share",
    description: "Reply properly to anyone who listens, comments, reposts or plays the track.",
    priority: "NORMAL",
  },
  {
    title: "Repost genuine support",
    description: "Share useful stories, DJ clips, comments or messages without overdoing it.",
    priority: "LOW",
  },
  {
    title: "Do not chase non-replies",
    description: "If someone does not respond, leave it. Do not follow up repeatedly with the same release link.",
    priority: "LOW",
  },
] as const

export async function ensureArtistNoSpamSharingDocument(prisma: PrismaClient) {
  return prisma.artistDocument.upsert({
    where: { id: ARTIST_NO_SPAM_SHARING_DOCUMENT_ID },
    update: {
      title,
      description: "How to share a release naturally with fans, friends, DJs and small pages without copy-paste spam.",
      type: "NOTE",
      content,
      isPinned: true,
    },
    create: {
      id: ARTIST_NO_SPAM_SHARING_DOCUMENT_ID,
      title,
      description: "How to share a release naturally with fans, friends, DJs and small pages without copy-paste spam.",
      type: "NOTE",
      content,
      isPinned: true,
    },
  })
}

export async function ensureArtistNoSpamSharingTemplates(prisma: PrismaClient) {
  await Promise.all(
    checklist.map((task, index) =>
      prisma.artistTaskTemplate.upsert({
        where: { id: `no-spam-sharing-template-${index + 1}` },
        update: {
          title: task.title,
          category,
          priority: task.priority,
          sortOrder: index + 1,
          isActive: true,
          description: task.description,
        },
        create: {
          id: `no-spam-sharing-template-${index + 1}`,
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

export async function assignArtistNoSpamSharingTasks(prisma: PrismaClient, artistId: string) {
  await ensureArtistNoSpamSharingDocument(prisma)

  let created = 0
  for (const [index, task] of checklist.entries()) {
    const existing = await prisma.artistTask.findFirst({
      where: {
        artistId,
        documentId: ARTIST_NO_SPAM_SHARING_DOCUMENT_ID,
        title: task.title,
      },
      select: { id: true },
    })

    if (existing) continue

    await prisma.artistTask.create({
      data: {
        artistId,
        documentId: ARTIST_NO_SPAM_SHARING_DOCUMENT_ID,
        title: task.title,
        description: task.description,
        category,
        priority: task.priority,
        status: "TODO",
        templateId: `no-spam-sharing-template-${index + 1}`,
      },
    })
    created += 1
  }

  return created
}

export async function seedArtistNoSpamSharing(prisma: PrismaClient) {
  const document = await ensureArtistNoSpamSharingDocument(prisma)
  await ensureArtistNoSpamSharingTemplates(prisma)

  const artists = await prisma.artist.findMany({ select: { id: true } })
  let createdTasks = 0
  for (const artist of artists) {
    createdTasks += await assignArtistNoSpamSharingTasks(prisma, artist.id)
  }

  return { document, templates: checklist.length, artists: artists.length, createdTasks }
}
