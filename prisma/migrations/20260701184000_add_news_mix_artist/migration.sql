-- Link mix news articles to an artist profile
ALTER TABLE "News" ADD COLUMN "mixArtistId" TEXT;

ALTER TABLE "News" ADD CONSTRAINT "News_mixArtistId_fkey"
  FOREIGN KEY ("mixArtistId") REFERENCES "Artist"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

CREATE INDEX "News_mixArtistId_idx" ON "News"("mixArtistId");
