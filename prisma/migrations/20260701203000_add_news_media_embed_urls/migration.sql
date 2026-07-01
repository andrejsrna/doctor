-- Add simple media URL fields for news/mix embeds
ALTER TABLE "News" ADD COLUMN "youtubeUrl" TEXT;
ALTER TABLE "News" ADD COLUMN "soundcloudUrl" TEXT;
