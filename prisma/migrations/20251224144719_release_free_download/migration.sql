-- CreateEnum
CREATE TYPE "ReleaseType" AS ENUM ('NORMAL', 'FREE_DOWNLOAD');

-- AlterTable
ALTER TABLE "Release" ADD COLUMN     "downloadFileKey" TEXT,
ADD COLUMN     "downloadFileName" TEXT,
ADD COLUMN     "downloadFileUrl" TEXT,
ADD COLUMN     "releaseType" "ReleaseType" NOT NULL DEFAULT 'NORMAL';

-- CreateTable
CREATE TABLE "ReleaseDownloadToken" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "releaseId" TEXT NOT NULL,

    CONSTRAINT "ReleaseDownloadToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ReleaseDownloadToken_token_key" ON "ReleaseDownloadToken"("token");

-- CreateIndex
CREATE INDEX "ReleaseDownloadToken_releaseId_idx" ON "ReleaseDownloadToken"("releaseId");

-- CreateIndex
CREATE INDEX "ReleaseDownloadToken_email_idx" ON "ReleaseDownloadToken"("email");

-- CreateIndex
CREATE INDEX "ReleaseDownloadToken_expiresAt_idx" ON "ReleaseDownloadToken"("expiresAt");

-- AddForeignKey
ALTER TABLE "ReleaseDownloadToken" ADD CONSTRAINT "ReleaseDownloadToken_releaseId_fkey" FOREIGN KEY ("releaseId") REFERENCES "Release"("id") ON DELETE CASCADE ON UPDATE CASCADE;
