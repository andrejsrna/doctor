export function validCalendarDate(value: unknown): value is string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const parsed = new Date(`${value}T00:00:00.000Z`)
  return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value
}

export function calendarDays(month: string): Array<string | null> {
  if (!/^\d{4}-\d{2}$/.test(month) || !validCalendarDate(`${month}-01`)) return []
  const first = new Date(`${month}-01T00:00:00Z`)
  const offset = (first.getUTCDay() + 6) % 7
  const count = new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth() + 1, 0)).getUTCDate()
  const days: Array<string | null> = Array(offset).fill(null)
  for (let day = 1; day <= count; day++) days.push(`${month}-${String(day).padStart(2, '0')}`)
  while (days.length % 7) days.push(null)
  return days
}

export function calendarPayload(value: unknown) {
  if (!value || typeof value !== 'object') throw new Error('Invalid entry')
  const data = value as Record<string, unknown>
  if (typeof data.title !== 'string' || !data.title.trim() || data.title.length > 300) throw new Error('Title is required (max 300 characters)')
  if (!validCalendarDate(data.releaseDate)) throw new Error('Select a valid release date')
  for (const [field, max] of [['catalogueNumber', 60], ['releaseId', 100], ['notes', 5000]] as const) {
    if (data[field] != null && (typeof data[field] !== 'string' || (data[field] as string).length > max)) throw new Error(`Invalid ${field}`)
  }
  return {
    title: data.title.trim(),
    releaseDate: new Date(`${data.releaseDate}T00:00:00.000Z`),
    catalogueNumber: typeof data.catalogueNumber === 'string' ? data.catalogueNumber.trim() || null : null,
    releaseId: typeof data.releaseId === 'string' ? data.releaseId.trim() || null : null,
    notes: typeof data.notes === 'string' ? data.notes.trim() || null : null,
  }
}
