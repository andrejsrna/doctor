import assert from 'node:assert/strict'
import test from 'node:test'
import { createHmac } from 'node:crypto'
import { formEncode, verifyWebhook } from '../lib/shop/stripe'
import { downloadToken, verifyDownloadToken } from '../lib/shop/tokens'
import { addressLines } from '../lib/shop/invoices'

process.env.SHOP_SECRET = 'test-secret-for-download-links'

const sign = (payload: string, secret: string, t: number) => `t=${t},v1=${createHmac('sha256', secret).update(`${t}.${payload}`).digest('hex')}`

test('webhook signature: accepts genuine, rejects tampered, wrong secret, stale and malformed', () => {
  const payload = JSON.stringify({ id: 'evt_1', type: 'checkout.session.completed', data: { object: { id: 'cs_1' } } })
  const now = Date.now()
  const t = Math.floor(now / 1000)
  assert.equal(verifyWebhook(payload, sign(payload, 'whsec_a', t), 'whsec_a', 300, now).id, 'evt_1')
  // Stripe sends several v1 signatures during secret rotation; any valid one passes.
  assert.equal(verifyWebhook(payload, `${sign(payload, 'whsec_old', t)},v1=${sign(payload, 'whsec_a', t).split('v1=')[1]}`, 'whsec_a', 300, now).id, 'evt_1')
  assert.throws(() => verifyWebhook(payload.replace('cs_1', 'cs_2'), sign(payload, 'whsec_a', t), 'whsec_a', 300, now), /Invalid/)
  assert.throws(() => verifyWebhook(payload, sign(payload, 'whsec_b', t), 'whsec_a', 300, now), /Invalid/)
  assert.throws(() => verifyWebhook(payload, sign(payload, 'whsec_a', t - 600), 'whsec_a', 300, now), /tolerance/)
  assert.throws(() => verifyWebhook(payload, null, 'whsec_a'), /Missing/)
  assert.throws(() => verifyWebhook(payload, 'garbage', 'whsec_a'), /Malformed/)
})

test('form encoding matches Stripe bracket syntax for nested line items', () => {
  const body = formEncode({ mode: 'payment', line_items: [{ quantity: 1, price_data: { unit_amount: 1000, product_data: { name: 'Pack', images: ['https://x/y.jpg'] } } }], metadata: { orderId: 'o1' }, skip: undefined })
  assert.equal(body.get('line_items[0][price_data][unit_amount]'), '1000')
  assert.equal(body.get('line_items[0][price_data][product_data][images][0]'), 'https://x/y.jpg')
  assert.equal(body.get('metadata[orderId]'), 'o1')
  assert.equal(body.has('skip'), false)
})

test('download tokens: valid until expiry, bound to the item, not forgeable', () => {
  const now = Date.UTC(2026, 9, 27)
  const token = downloadToken('item_123', now, 30)
  assert.equal(verifyDownloadToken(token, now + 29 * 86400_000), 'item_123')
  assert.equal(verifyDownloadToken(token, now + 31 * 86400_000), null)
  const [, exp, sig] = token.split('.')
  assert.equal(verifyDownloadToken(`item_999.${exp}.${sig}`, now), null)
  assert.equal(verifyDownloadToken(`item_123.${Number(exp) + 86400}.${sig}`, now), null)
  assert.equal(verifyDownloadToken('nope', now), null)
})

test('invoice address lines skip empty Stripe fields', () => {
  assert.deepEqual(addressLines({ line1: 'Main St 1', line2: null, postal_code: '10115', city: 'Berlin', state: '', country: 'DE' }), ['Main St 1', '10115 Berlin', 'DE'])
  assert.deepEqual(addressLines(null), [])
})
