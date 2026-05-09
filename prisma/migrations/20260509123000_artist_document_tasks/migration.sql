-- AlterTable
ALTER TABLE "public"."ArtistTask" ADD COLUMN "documentId" TEXT;

-- CreateIndex
CREATE INDEX "ArtistTask_documentId_idx" ON "public"."ArtistTask"("documentId");

-- AddForeignKey
ALTER TABLE "public"."ArtistTask" ADD CONSTRAINT "ArtistTask_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "public"."ArtistDocument"("id") ON DELETE SET NULL ON UPDATE CASCADE;
