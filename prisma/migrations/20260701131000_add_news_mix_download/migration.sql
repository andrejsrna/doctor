-- Add optional downloadable mix file fields for mix news articles
ALTER TABLE "News" ADD COLUMN "mixDownloadUrl" TEXT;
ALTER TABLE "News" ADD COLUMN "mixDownloadKey" TEXT;
