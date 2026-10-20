/** Player helpers shared by the news post page and /neurofunk-dnb-mixes. */

export function youtubeId(url?: string | null) {
  if (!url) return null
  try {
    const u = new URL(url.trim())
    if (u.hostname.includes('youtu.be')) return u.pathname.slice(1) || null
    const parts = u.pathname.split('/')
    if (parts[1] === 'shorts' || parts[1] === 'embed') return parts[2] || null
    return u.searchParams.get('v')
  } catch {
    return null
  }
}

const SC_PARAMS = 'color=%2339ff14&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false'

/** Player URL from the `soundcloudUrl` field, else the src of the legacy WordPress `scsc` embed. */
export function soundcloudSrc(url?: string | null, legacyEmbed?: string | null) {
  try {
    if (url) {
      const u = new URL(url.trim())
      if (u.hostname.endsWith('soundcloud.com')) return `https://w.soundcloud.com/player/?url=${encodeURIComponent(u.toString())}&${SC_PARAMS}`
    }
    const src = legacyEmbed?.match(/src="([^"]+)"/)?.[1]?.replace(/&amp;/g, '&')
    if (src && new URL(src).hostname === 'w.soundcloud.com') {
      const track = new URL(src).searchParams.get('url')
      if (track) return `https://w.soundcloud.com/player/?url=${encodeURIComponent(track)}&${SC_PARAMS}`
    }
  } catch {
    /* malformed URL — no player */
  }
  return null
}
