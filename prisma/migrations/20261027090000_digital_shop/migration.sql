-- CreateEnum
CREATE TYPE "ProductType" AS ENUM ('SAMPLE_PACK', 'TRACK');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'PAID', 'REFUNDED', 'CANCELED');

-- CreateEnum
CREATE TYPE "InvoiceState" AS ENUM ('PENDING', 'ISSUED', 'FAILED');

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "type" "ProductType" NOT NULL DEFAULT 'SAMPLE_PACK',
    "title" TEXT NOT NULL,
    "priceCents" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'eur',
    "active" BOOLEAN NOT NULL DEFAULT false,
    "fileKey" TEXT,
    "fileName" TEXT,
    "fileSize" INTEGER,
    "releaseId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "email" TEXT,
    "customerName" TEXT,
    "billingAddress" JSONB,
    "taxIds" JSONB,
    "currency" TEXT NOT NULL DEFAULT 'eur',
    "amountTotal" INTEGER NOT NULL,
    "stripeSessionId" TEXT,
    "stripePaymentIntentId" TEXT,
    "withdrawalConsentAt" TIMESTAMP(3) NOT NULL,
    "paidAt" TIMESTAMP(3),
    "refundedAt" TIMESTAMP(3),
    "emailSentAt" TIMESTAMP(3),
    "invoiceState" "InvoiceState" NOT NULL DEFAULT 'PENDING',
    "invoiceNumber" TEXT,
    "invoiceUrl" TEXT,
    "invoiceAttempts" INTEGER NOT NULL DEFAULT 0,
    "invoiceError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "priceCents" INTEGER NOT NULL,
    "downloadCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Product_releaseId_key" ON "Product"("releaseId");

-- CreateIndex
CREATE UNIQUE INDEX "Order_stripeSessionId_key" ON "Order"("stripeSessionId");

-- CreateIndex
CREATE UNIQUE INDEX "Order_stripePaymentIntentId_key" ON "Order"("stripePaymentIntentId");

-- CreateIndex
CREATE UNIQUE INDEX "Order_invoiceNumber_key" ON "Order"("invoiceNumber");

-- CreateIndex
CREATE INDEX "Order_email_idx" ON "Order"("email");

-- CreateIndex
CREATE INDEX "Order_status_idx" ON "Order"("status");

-- CreateIndex
CREATE INDEX "Order_createdAt_idx" ON "Order"("createdAt");

-- CreateIndex
CREATE INDEX "OrderItem_orderId_idx" ON "OrderItem"("orderId");

-- CreateIndex
CREATE INDEX "OrderItem_productId_idx" ON "OrderItem"("productId");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_releaseId_fkey" FOREIGN KEY ("releaseId") REFERENCES "Release"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

