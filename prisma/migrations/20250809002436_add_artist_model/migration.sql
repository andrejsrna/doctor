-- CreateTable
CREATE TABLE "public"."Artist" (
    "id" TEXT NOT NULL,
    "wpId" INTEGER,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "bio" TEXT,
    "imageUrl" TEXT,
    "imageKey" TEXT,
    "soundcloud" TEXT,
    "spotify" TEXT,
    "facebook" TEXT,
    "instagram" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Artist_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Artist_wpId_key" ON "public"."Artist"("wpId");

-- CreateIndex
CREATE UNIQUE INDEX "Artist_slug_key" ON "public"."Artist"("slug");

-- CreateIndex
CREATE INDEX "Artist_slug_idx" ON "public"."Artist"("slug");

-- CreateIndex
CREATE INDEX "Artist_name_idx" ON "public"."Artist"("name");
