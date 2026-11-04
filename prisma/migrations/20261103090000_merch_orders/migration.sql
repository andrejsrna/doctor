-- Print-on-demand merch (Printful) orders, paid through Stripe Checkout.
CREATE TYPE "MerchFulfilment" AS ENUM ('PENDING', 'DRAFT', 'SUBMITTED', 'SHIPPED', 'FAILED', 'CANCELED');

CREATE TABLE "MerchOrder" (
    "id" TEXT NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "email" TEXT,
    "customerName" TEXT,
    "shippingAddress" JSONB,
    "country" TEXT NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'eur',
    "itemsCents" INTEGER NOT NULL,
    "shippingCents" INTEGER NOT NULL,
    "amountTotal" INTEGER NOT NULL,
    "shippingRate" TEXT NOT NULL,
    "shippingName" TEXT,
    "stripeSessionId" TEXT,
    "stripePaymentIntentId" TEXT,
    "paidAt" TIMESTAMP(3),
    "refundedAt" TIMESTAMP(3),
    "emailSentAt" TIMESTAMP(3),
    "fulfilment" "MerchFulfilment" NOT NULL DEFAULT 'PENDING',
    "printfulOrderId" INTEGER,
    "printfulAttempts" INTEGER NOT NULL DEFAULT 0,
    "printfulError" TEXT,
    "trackingNumber" TEXT,
    "trackingUrl" TEXT,
    "carrier" TEXT,
    "shippedAt" TIMESTAMP(3),
    "invoiceState" "InvoiceState" NOT NULL DEFAULT 'PENDING',
    "invoiceNumber" TEXT,
    "invoiceUrl" TEXT,
    "invoiceAttempts" INTEGER NOT NULL DEFAULT 0,
    "invoiceError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MerchOrder_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "MerchOrderItem" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "syncVariantId" BIGINT NOT NULL,
    "title" TEXT NOT NULL,
    "size" TEXT,
    "color" TEXT,
    "imageUrl" TEXT,
    "quantity" INTEGER NOT NULL,
    "unitCents" INTEGER NOT NULL,

    CONSTRAINT "MerchOrderItem_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "MerchOrder_stripeSessionId_key" ON "MerchOrder"("stripeSessionId");
CREATE UNIQUE INDEX "MerchOrder_stripePaymentIntentId_key" ON "MerchOrder"("stripePaymentIntentId");
CREATE UNIQUE INDEX "MerchOrder_printfulOrderId_key" ON "MerchOrder"("printfulOrderId");
CREATE UNIQUE INDEX "MerchOrder_invoiceNumber_key" ON "MerchOrder"("invoiceNumber");
CREATE INDEX "MerchOrder_email_idx" ON "MerchOrder"("email");
CREATE INDEX "MerchOrder_status_idx" ON "MerchOrder"("status");
CREATE INDEX "MerchOrder_createdAt_idx" ON "MerchOrder"("createdAt");
CREATE INDEX "MerchOrderItem_orderId_idx" ON "MerchOrderItem"("orderId");

ALTER TABLE "MerchOrderItem" ADD CONSTRAINT "MerchOrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "MerchOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;
