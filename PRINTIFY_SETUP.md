# Printify setup

This project supports pulling a product catalog from Printify (server-side) and exposing it via `/shop` + `/api/printify/*`.

## Environment variables

- `PRINTIFY_API` (required): Printify API token.
- `PRINTIFY_SHOP_ID` (optional): If you have multiple shops; otherwise the first shop is used.

## Quick smoke test

1. Start the dev server: `npm run dev`
2. Open the shop page: `http://localhost:3000/shop`
3. Test API routes:
   - `GET /api/printify/shops`
   - `GET /api/printify/products?shopId=...`
   - `GET /api/printify/products/:productId?shopId=...`

## Order creation (admin-only)

There is a protected endpoint for creating Printify orders:

- `POST /api/admin/printify/orders`

It requires an authenticated session (same as the other admin APIs). By default it will force `payload.is_draft=true` unless you explicitly set it.

Request body:

```json
{
  "shopId": 1234567,
  "payload": { "is_draft": true, "...": "Printify order payload" }
}
```

## Selling products (recommended next step)

To actually “sell” (take payment), you typically:

1. Add Stripe Checkout/PaymentIntent for your cart.
2. On payment success (webhook), call `POST /api/admin/printify/orders` to create the Printify order.
3. Store order + fulfillment status in your DB.

