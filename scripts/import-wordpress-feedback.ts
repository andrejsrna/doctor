import { PrismaClient } from '@prisma/client'
import mysql from 'mysql2/promise'
import { unserialize } from 'php-serialize'

const prisma = new PrismaClient()

// Use same WP DB creds as subscribers import
const wpConfig = {
  host: '188.245.226.152',
  port: 5912,
  user: 'PF6DbUTp1ONfQGwj',
  password: 'gpc9ec3T1Rz1mPzviouvDZ4wQobLXjCn',
  database: 'wordpress'
}

function parseSerializedArray(input: string): any[] | null {
  try {
    const data = unserialize(input) as any
    if (!data) return null
    if (Array.isArray(data)) return data
    if (typeof data === 'object') {
      const values = Object.values(data)
      const hasNested = values.some(v => v && typeof v === 'object')
      return hasNested ? values : [data]
    }
    return null
  } catch {
    return null
  }
}

async function run() {
  console.log('Starting WP feedback import...')
  const conn = await mysql.createConnection(wpConfig)

  // Query postmeta for keys
  const [rows] = await conn.execute(
    "SELECT post_id, meta_key, meta_value FROM wp_postmeta WHERE meta_key IN (\n      '_mlds_feedback', '_mlds_average_rating', '_mlds_track_token', '_mlds_email_sent', '_mlds_track_interaction', '_mlds_recipient_groups', '_mlds_upload_date', '_mlds_batch_track_ids'\n    ) ORDER BY post_id"
  ) as [Array<{ post_id: number; meta_key: string; meta_value: string }>, any]

  const byPost = new Map<number, Record<string, string>>()
  for (const r of rows) {
    if (!byPost.has(r.post_id)) byPost.set(r.post_id, {})
    byPost.get(r.post_id)![r.meta_key] = r.meta_value
  }

  let imported = 0
  for (const [postId, meta] of byPost.entries()) {
    const token = meta['_mlds_track_token'] || undefined
    const avg = meta['_mlds_average_rating'] ? parseFloat(meta['_mlds_average_rating']) : undefined
    const uploadDate = meta['_mlds_upload_date'] || ''
    const serialized = meta['_mlds_feedback']
    const parsed = serialized ? parseSerializedArray(serialized) : null

    if (!parsed || !parsed.length) continue

    // Clear previously imported feedback for this post to avoid duplicates
    await prisma.demoFeedback.deleteMany({ where: { wpPostId: postId, recipientEmail: 'import@dnbdoctor.com' } })

    for (const [idx, entry] of parsed.entries()) {
      const ratingRaw = (entry?.rating ?? entry?.stars ?? entry?.score ?? entry?.rate) as any
      const rating = typeof ratingRaw === 'number' ? ratingRaw : parseInt(String(ratingRaw || ''), 10)
      const feedbackText = ((): string | null => {
        const txt = (entry?.feedback ?? entry?.comment ?? entry?.text ?? entry?.message ?? '').toString().trim()
        if (txt) return txt
        try { return JSON.stringify(entry) } catch { return null }
      })()
      const rawEmail = (entry?.email ?? entry?.from ?? '').toString().trim()
      const nameText = ((): string | null => {
        const nm = (entry?.name ?? entry?.author ?? entry?.user ?? '').toString().trim()
        return nm || (rawEmail ? rawEmail.split('@')[0] : 'Anonymous')
      })()
      const dateText = String(entry?.date || entry?.submitted_at || uploadDate || '').trim()
      const submittedAt = dateText ? new Date(dateText) : undefined

      const uniqueToken = `${token || 'wp'}-fb-${postId}-${idx}-${Math.random().toString(36).slice(2,8)}`

      await prisma.demoFeedback.create({
        data: {
          token: uniqueToken,
          recipientEmail: 'import@dnbdoctor.com',
          subject: `Imported feedback for post ${postId}`,
          message: 'Imported from WordPress',
          files: [],
          rating: isNaN(rating) ? (isNaN(avg || NaN) ? null : Math.round((avg as number))) : rating,
          feedback: feedbackText,
          name: nameText,
          senderEmail: rawEmail || null,
          submittedAt,
          trackToken: token || null,
          wpPostId: postId,
          source: 'wordpress_postmeta',
        }
      })
      imported++
    }
  }

  await conn.end()
  console.log(`Imported feedback entries: ${imported}`)
}

run().then(() => process.exit(0)).catch(err => { console.error(err); process.exit(1) })


