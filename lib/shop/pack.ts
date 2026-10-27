export type PackItem = {
  name: string
  title: string
  key: string | null
  bpm: number | null
  bytes: number
  seconds?: number
  bars?: number
  preview?: string
  previewSeconds?: number
  peaks?: number[]
}

export type PackGroup = { id: string; folder: string; label: string; kind: 'audio' | 'preset'; items: PackItem[] }

export type PackManifest = {
  version: 1
  generatedAt: string
  zipBytes: number
  fileCount: number
  abletonWarp: boolean
  audio: { sampleRate: number; bits: number; channels: number; format: string } | null
  groups: PackGroup[]
}

/** Public manifest written by scripts/shop-pack-manifest.ts; null when the pack hasn't been scanned yet. */
export async function loadPackManifest(releaseSlug: string): Promise<PackManifest | null> {
  const base = (process.env.R2_PUBLIC_BASE_URL || '').replace(/\/$/, '')
  if (!base) return null
  try {
    const res = await fetch(`${base}/releases/${encodeURIComponent(releaseSlug)}/pack/manifest.json`, { next: { revalidate: 300 } })
    if (!res.ok) return null
    const m = (await res.json()) as PackManifest
    return m?.version === 1 && Array.isArray(m.groups) ? m : null
  } catch {
    return null
  }
}

export const formatBytes = (n: number) => (n >= 1e6 ? `${Math.round(n / 1e6)} MB` : `${Math.max(1, Math.round(n / 1e3))} KB`)
