-- CreateTable
CREATE TABLE "public"."News" (
    "id" TEXT NOT NULL,
    "wpId" INTEGER,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "coverImageUrl" TEXT,
    "coverImageKey" TEXT,
    "scsc" TEXT,
    "relatedArtistName" TEXT,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "News_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "News_wpId_key" ON "public"."News"("wpId");

-- CreateIndex
CREATE UNIQUE INDEX "News_slug_key" ON "public"."News"("slug");

-- CreateIndex
CREATE INDEX "News_publishedAt_idx" ON "public"."News"("publishedAt");

-- CreateIndex
CREATE INDEX "News_slug_idx" ON "public"."News"("slug");

-- CreateIndex
CREATE INDEX "News_title_idx" ON "public"."News"("title");
