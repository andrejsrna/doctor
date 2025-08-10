-- AlterTable
ALTER TABLE "public"."DemoFeedback" ADD COLUMN     "senderEmail" TEXT,
ADD COLUMN     "source" TEXT,
ADD COLUMN     "trackToken" TEXT,
ADD COLUMN     "wpPostId" INTEGER;

-- AlterTable
ALTER TABLE "public"."categories" ADD COLUMN     "influencersEnabled" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "public"."Release" (
    "id" TEXT NOT NULL,
    "wpId" INTEGER,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "coverImageUrl" TEXT,
    "coverImageKey" TEXT,
    "previewUrl" TEXT,
    "spotify" TEXT,
    "appleMusic" TEXT,
    "beatport" TEXT,
    "deezer" TEXT,
    "soundcloud" TEXT,
    "youtubeMusic" TEXT,
    "junoDownload" TEXT,
    "tidal" TEXT,
    "categories" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Release_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Release_wpId_key" ON "public"."Release"("wpId");

-- CreateIndex
CREATE UNIQUE INDEX "Release_slug_key" ON "public"."Release"("slug");

-- CreateIndex
CREATE INDEX "Release_publishedAt_idx" ON "public"."Release"("publishedAt");

-- CreateIndex
CREATE INDEX "Release_slug_idx" ON "public"."Release"("slug");

-- CreateIndex
CREATE INDEX "Release_title_idx" ON "public"."Release"("title");
