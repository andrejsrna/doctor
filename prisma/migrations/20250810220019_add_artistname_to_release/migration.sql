-- AlterTable
ALTER TABLE "public"."Release" ADD COLUMN     "artistName" TEXT;

-- CreateIndex
CREATE INDEX "Release_artistName_idx" ON "public"."Release"("artistName");
