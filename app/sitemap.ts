import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

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
      url: `${baseUrl}/what-is-drum-and-bass`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/drum-and-bass-subgenres`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
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
