// server component: the label's real footprint feeds the manifesto stats
import { prisma } from '@/lib/prisma'
import ExperienceAndBookingClient from './ExperienceAndBookingClient'

export default async function ExperienceAndBooking() {
  const [releases, artists, mixes] = await Promise.all([
    prisma.release.count({ where: { publishedAt: { not: null } } }),
    prisma.artist.count(),
    prisma.news.count({ where: { categories: { has: 'Mixes' }, publishedAt: { not: null } } }),
  ]).catch(() => [0, 0, 0])

  return <ExperienceAndBookingClient stats={{ releases, artists, mixes }} />
}
