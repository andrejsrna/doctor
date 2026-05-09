ALTER TABLE "public"."ArtistDocument" ADD COLUMN "isTemplate" BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX "ArtistDocument_isTemplate_idx" ON "public"."ArtistDocument"("isTemplate");
