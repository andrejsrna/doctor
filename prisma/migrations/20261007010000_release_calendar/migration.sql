CREATE TABLE "ReleaseCalendarEntry" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "releaseDate" DATE NOT NULL,
  "catalogueNumber" TEXT,
  "releaseId" TEXT,
  "notes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ReleaseCalendarEntry_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "ReleaseCalendarEntry_catalogueNumber_key" ON "ReleaseCalendarEntry"("catalogueNumber");
CREATE INDEX "ReleaseCalendarEntry_releaseDate_idx" ON "ReleaseCalendarEntry"("releaseDate");
