-- A release can sell several products: the EP bundle plus each track.
ALTER TYPE "ProductType" ADD VALUE 'RELEASE';

DROP INDEX "Product_releaseId_key";
CREATE INDEX "Product_releaseId_idx" ON "Product"("releaseId");

ALTER TABLE "Product" ADD COLUMN "position" INTEGER NOT NULL DEFAULT 0;
