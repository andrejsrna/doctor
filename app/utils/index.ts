export function getReleaseImageUrl({ coverImageUrl, coverImageKey }: { coverImageUrl?: string | null; coverImageKey?: string | null }) {
  const host = process.env.R2_PUBLIC_HOSTNAME
  return coverImageUrl || (host && coverImageKey ? `https://${host}/${coverImageKey}` : undefined)
}


