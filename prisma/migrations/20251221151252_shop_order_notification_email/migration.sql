-- CreateEnum
CREATE TYPE "public"."ShopOrderStatus" AS ENUM ('PENDING', 'PAID', 'CANCELED', 'PRINTIFY_CREATED', 'PRINTIFY_FAILED');

-- CreateTable
CREATE TABLE "public"."ShopOrder" (
    "id" TEXT NOT NULL,
    "stripeSessionId" TEXT NOT NULL,
    "stripePaymentIntentId" TEXT,
    "status" "public"."ShopOrderStatus" NOT NULL DEFAULT 'PENDING',
    "currency" TEXT NOT NULL DEFAULT 'usd',
    "amountTotal" INTEGER,
    "printifyShopId" INTEGER,
    "printifyProductId" TEXT NOT NULL,
    "printifyVariantId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "customerEmail" TEXT,
    "customerName" TEXT,
    "shippingAddress" JSONB,
    "stripeRaw" JSONB,
    "printifyOrderId" TEXT,
    "printifyRaw" JSONB,
    "notificationEmailSentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShopOrder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ShopOrder_stripeSessionId_key" ON "public"."ShopOrder"("stripeSessionId");

-- CreateIndex
CREATE INDEX "ShopOrder_status_idx" ON "public"."ShopOrder"("status");

-- CreateIndex
CREATE INDEX "ShopOrder_createdAt_idx" ON "public"."ShopOrder"("createdAt");

-- CreateIndex
CREATE INDEX "ShopOrder_stripePaymentIntentId_idx" ON "public"."ShopOrder"("stripePaymentIntentId");
