export function sanitizeHtml(input: string): string {
  if (!input) return ''
  // `sanitize-html` is a pure JS sanitizer that works in both Node and the browser
  // and avoids pulling in JSDOM (which can break builds in some environments).
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const sanitize = require('sanitize-html') as typeof import('sanitize-html')

  return sanitize(input, {
    allowedTags: [
      ...sanitize.defaults.allowedTags,
      'img',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'figure',
      'figcaption',
      'span',
      'div',
      'hr',
      'br',
      'pre',
      'code',
    ],
    allowedAttributes: {
      a: ['href', 'name', 'target', 'rel', 'title'],
      img: ['src', 'alt', 'title', 'width', 'height', 'loading', 'decoding'],
      '*': ['class', 'id', 'aria-label', 'aria-hidden'],
    },
    allowedSchemes: ['http', 'https', 'mailto', 'tel'],
    allowedSchemesByTag: {
      img: ['http', 'https', 'data'],
    },
    allowProtocolRelative: false,
    transformTags: {
      a: (tagName, attribs) => {
        const next = { ...attribs }
        const target = (next.target || '').toLowerCase()
        if (target === '_blank') {
          const rel = (next.rel || '')
            .split(' ')
            .map((s) => s.trim())
            .filter(Boolean)
          if (!rel.includes('noopener')) rel.push('noopener')
          if (!rel.includes('noreferrer')) rel.push('noreferrer')
          next.rel = rel.join(' ')
        }
        return { tagName, attribs: next }
      },
    },
  })
}

