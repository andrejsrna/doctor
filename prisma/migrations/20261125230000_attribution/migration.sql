-- AlterTable
ALTER TABLE "Order" ADD COLUMN "attribution" JSONB;

-- AlterTable
ALTER TABLE "MerchOrder" ADD COLUMN "attribution" JSONB;

-- AlterTable
ALTER TABLE "ReleaseDownloadToken" ADD COLUMN "attribution" JSONB;
