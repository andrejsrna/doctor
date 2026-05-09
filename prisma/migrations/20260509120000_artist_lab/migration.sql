-- AlterEnum
ALTER TYPE "public"."Role" ADD VALUE IF NOT EXISTS 'ARTIST';

-- CreateEnum
CREATE TYPE "public"."ArtistMemberRole" AS ENUM ('OWNER', 'MANAGER', 'MEMBER');

-- CreateEnum
CREATE TYPE "public"."ArtistTaskPriority" AS ENUM ('LOW', 'NORMAL', 'HIGH');

-- CreateEnum
CREATE TYPE "public"."ArtistTaskStatus" AS ENUM ('TODO', 'IN_PROGRESS', 'DONE', 'SKIPPED');

-- CreateEnum
CREATE TYPE "public"."ArtistReleasePlanStatus" AS ENUM ('PLANNED', 'ACTIVE', 'COMPLETE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "public"."ArtistDocumentType" AS ENUM ('LINK', 'FILE', 'NOTE');

-- CreateTable
CREATE TABLE "public"."ArtistMember" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "artistId" TEXT NOT NULL,
    "role" "public"."ArtistMemberRole" NOT NULL DEFAULT 'OWNER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ArtistMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ArtistTaskTemplate" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "priority" "public"."ArtistTaskPriority" NOT NULL DEFAULT 'NORMAL',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ArtistTaskTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ArtistReleasePlan" (
    "id" TEXT NOT NULL,
    "artistId" TEXT NOT NULL,
    "releaseId" TEXT,
    "name" TEXT NOT NULL,
    "releaseDate" TIMESTAMP(3),
    "status" "public"."ArtistReleasePlanStatus" NOT NULL DEFAULT 'PLANNED',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ArtistReleasePlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ArtistTask" (
    "id" TEXT NOT NULL,
    "artistId" TEXT NOT NULL,
    "templateId" TEXT,
    "releasePlanId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "priority" "public"."ArtistTaskPriority" NOT NULL DEFAULT 'NORMAL',
    "status" "public"."ArtistTaskStatus" NOT NULL DEFAULT 'TODO',
    "dueAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "completedById" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ArtistTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ArtistDocument" (
    "id" TEXT NOT NULL,
    "artistId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" "public"."ArtistDocumentType" NOT NULL DEFAULT 'LINK',
    "url" TEXT,
    "content" TEXT,
    "isPinned" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ArtistDocument_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ArtistMember_userId_artistId_key" ON "public"."ArtistMember"("userId", "artistId");

-- CreateIndex
CREATE INDEX "ArtistMember_artistId_idx" ON "public"."ArtistMember"("artistId");

-- CreateIndex
CREATE INDEX "ArtistMember_userId_idx" ON "public"."ArtistMember"("userId");

-- CreateIndex
CREATE INDEX "ArtistTaskTemplate_category_idx" ON "public"."ArtistTaskTemplate"("category");

-- CreateIndex
CREATE INDEX "ArtistTaskTemplate_isActive_idx" ON "public"."ArtistTaskTemplate"("isActive");

-- CreateIndex
CREATE INDEX "ArtistReleasePlan_artistId_idx" ON "public"."ArtistReleasePlan"("artistId");

-- CreateIndex
CREATE INDEX "ArtistReleasePlan_releaseId_idx" ON "public"."ArtistReleasePlan"("releaseId");

-- CreateIndex
CREATE INDEX "ArtistReleasePlan_status_idx" ON "public"."ArtistReleasePlan"("status");

-- CreateIndex
CREATE INDEX "ArtistTask_artistId_idx" ON "public"."ArtistTask"("artistId");

-- CreateIndex
CREATE INDEX "ArtistTask_templateId_idx" ON "public"."ArtistTask"("templateId");

-- CreateIndex
CREATE INDEX "ArtistTask_releasePlanId_idx" ON "public"."ArtistTask"("releasePlanId");

-- CreateIndex
CREATE INDEX "ArtistTask_status_idx" ON "public"."ArtistTask"("status");

-- CreateIndex
CREATE INDEX "ArtistTask_dueAt_idx" ON "public"."ArtistTask"("dueAt");

-- CreateIndex
CREATE INDEX "ArtistDocument_artistId_idx" ON "public"."ArtistDocument"("artistId");

-- CreateIndex
CREATE INDEX "ArtistDocument_isPinned_idx" ON "public"."ArtistDocument"("isPinned");

-- AddForeignKey
ALTER TABLE "public"."ArtistMember" ADD CONSTRAINT "ArtistMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ArtistMember" ADD CONSTRAINT "ArtistMember_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "public"."Artist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ArtistReleasePlan" ADD CONSTRAINT "ArtistReleasePlan_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "public"."Artist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ArtistReleasePlan" ADD CONSTRAINT "ArtistReleasePlan_releaseId_fkey" FOREIGN KEY ("releaseId") REFERENCES "public"."Release"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ArtistTask" ADD CONSTRAINT "ArtistTask_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "public"."Artist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ArtistTask" ADD CONSTRAINT "ArtistTask_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "public"."ArtistTaskTemplate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ArtistTask" ADD CONSTRAINT "ArtistTask_releasePlanId_fkey" FOREIGN KEY ("releasePlanId") REFERENCES "public"."ArtistReleasePlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ArtistTask" ADD CONSTRAINT "ArtistTask_completedById_fkey" FOREIGN KEY ("completedById") REFERENCES "public"."user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ArtistDocument" ADD CONSTRAINT "ArtistDocument_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "public"."Artist"("id") ON DELETE CASCADE ON UPDATE CASCADE;
