export function getReleaseImageUrl({ coverImageUrl, coverImageKey }: { coverImageUrl?: string | null; coverImageKey?: string | null }) {
  const host = process.env.R2_PUBLIC_HOSTNAME
  return coverImageUrl || (host && coverImageKey ? `https://${host}/${coverImageKey}` : undefined)
}

export function getArtworkImageUrl({ artworkImageUrl, artworkImageKey }: { artworkImageUrl?: string | null; artworkImageKey?: string | null }) {
  const host = process.env.R2_PUBLIC_HOSTNAME
  return artworkImageUrl || (host && artworkImageKey ? `https://${host}/${artworkImageKey}` : undefined)
}

