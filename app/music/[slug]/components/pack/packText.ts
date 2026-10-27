import type { PackGroup, PackManifest } from '@/lib/shop/pack'

/** "Bass loop 03", "Pad 01", "Bass preset 07" — readable names for raw file stems. */
export function itemTitle(group: PackGroup, index: number) {
  const t = group.items[index]?.title.toUpperCase() ?? ''
  const n = String(index + 1).padStart(2, '0')
  if (group.kind === 'preset') return `${t.includes('SYNTH') ? 'Synth' : t.includes('BASS') ? 'Bass' : 'Serum'} preset ${n}`
  if (t.includes('PAD')) return `Pad ${n}`
  if (t.includes('SYNTH')) return `Synth ${n}`
  if (t.includes('DRUM')) return `Drum loop ${n}`
  if (t.includes('BASS')) return `Bass loop ${n}`
  return `Sound ${n}`
}

/** "11 Serum presets · 6 bass loops · …" */
export function contentsLine(m: PackManifest) {
  return m.groups.map((g) => `${g.items.length} ${g.label.toLowerCase().replace('serum', 'Serum')}`).join(' · ')
}
