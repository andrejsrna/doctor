import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://dnbdoctor.com'
  
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/music`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/artists`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/news`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/newsletter`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/submit-demo`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/guidelines`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/what-is-drum-and-bass`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/types-of-dnb`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/how-to-produce-neurofunk`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    // release collections and landing pages linked from the nav / footer
    ...(
      [
        ['/albums', 'weekly', 0.8],
        ['/music-packs', 'weekly', 0.7],
        ['/sample-packs', 'weekly', 0.7],
        ['/neurofunk-dnb-mixes', 'weekly', 0.8],
        ['/bulk-sale', 'monthly', 0.6],
        ['/core-artists', 'monthly', 0.6],
        ['/neurofunk-dnb', 'monthly', 0.8],
        ['/dnb-bpm', 'monthly', 0.8],
        ['/neurofunk-spotify', 'monthly', 0.6],
        ['/drum-and-bass-history', 'monthly', 0.8],
        ['/recommended-tools', 'monthly', 0.5],
      ] as const
    ).map(([path, changeFrequency, priority]) => ({ url: `${baseUrl}${path}`, lastModified: new Date(), changeFrequency, priority })),
  ]

  try {
    // Fetch all releases
    const releases = await prisma.release.findMany({
      select: {
        slug: true,
        updatedAt: true,
        publishedAt: true,
      },
      where: {
        publishedAt: {
          not: null,
        },
      },
      orderBy: {
        publishedAt: 'desc',
      },
    })

    const releasePages: MetadataRoute.Sitemap = releases.map((release) => ({
      url: `${baseUrl}/music/${release.slug}`,
      lastModified: release.updatedAt,
      changeFrequency: 'weekly',
      priority: 0.8,
    }))

    // Fetch all artists
    const artists = await prisma.artist.findMany({
      select: {
        slug: true,
        updatedAt: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    })

    const artistPages: MetadataRoute.Sitemap = artists.map((artist) => ({
      url: `${baseUrl}/artists/${artist.slug}`,
      lastModified: artist.updatedAt,
      changeFrequency: 'weekly',
      priority: 0.7,
    }))

    // Fetch all news
    const news = await prisma.news.findMany({
      select: {
        slug: true,
        updatedAt: true,
        publishedAt: true,
      },
      where: {
        publishedAt: {
          not: null,
        },
      },
      orderBy: {
        publishedAt: 'desc',
      },
    })

    const newsPages: MetadataRoute.Sitemap = news.map((item) => ({
      url: `${baseUrl}/news/${item.slug}`,
      lastModified: item.updatedAt,
      changeFrequency: 'monthly',
      priority: 0.6,
    }))

    return [...staticPages, ...releasePages, ...artistPages, ...newsPages]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    // Return static pages if database query fails
    return staticPages
  }
}
