const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/**
 * "21 Aug 2026" in UTC, identical on server and client.
 * Don't use toLocaleDateString('en-GB', { month: 'short' }) in rendered output: Node's ICU prints
 * "Sept" while browsers print "Sep", so every September date causes a hydration mismatch.
 */
export function shortDate(input: string | Date | null | undefined, parts: { day?: boolean; year?: boolean } = {}) {
  if (!input) return ''
  const d = new Date(input)
  if (Number.isNaN(d.getTime())) return ''
  const { day = true, year = true } = parts
  return [day && String(d.getUTCDate()).padStart(2, '0'), MONTHS[d.getUTCMonth()], year && d.getUTCFullYear()].filter(Boolean).join(' ')
}
