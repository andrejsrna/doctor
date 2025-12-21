# Stripe setup

This project uses Stripe Checkout for payments. After a successful payment, an internal order is stored and can be fulfilled from `/admin/orders` (including creating a Printify draft order).

## Environment variables

- `STRIPE_SECRET_KEY` (required)
- `STRIPE_WEBHOOK_SECRET` (required)
- `BASE_URL` (recommended): used for Stripe `success_url` / `cancel_url`

## Webhook

Stripe should send `checkout.session.completed` to:

- `POST /api/stripe/webhook`

Local dev (Stripe CLI):

1. `stripe listen --forward-to localhost:3000/api/stripe/webhook`
2. Copy `whsec_...` into `STRIPE_WEBHOOK_SECRET`

## Flow

1. User clicks Buy → `POST /api/stripe/checkout-session`
2. Stripe redirects back to `/shop/success?session_id=...`
3. Webhook stores the order in DB
4. Admin fulfills it in `/admin/orders` (button “Create Printify Draft”)

## Shipping

Shipping is estimated from Printify (standard) based on the selected variant, quantity, and destination country:

- `GET /api/printify/shipping?productId=...&variantId=...&quantity=...&country=...`

The Stripe checkout session includes a shipping line item using that estimate and locks checkout to the selected country.
