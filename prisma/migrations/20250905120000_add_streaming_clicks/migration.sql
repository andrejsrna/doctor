-- CreateTable
CREATE TABLE "public"."StreamingClick" (
    "id" TEXT NOT NULL,
    "releaseId" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "lastClickedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StreamingClick_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StreamingClick_releaseId_platform_key" ON "public"."StreamingClick"("releaseId", "platform");

-- CreateIndex
CREATE INDEX "StreamingClick_platform_idx" ON "public"."StreamingClick"("platform");

-- AddForeignKey
ALTER TABLE "public"."StreamingClick" ADD CONSTRAINT "StreamingClick_releaseId_fkey" FOREIGN KEY ("releaseId") REFERENCES "public"."Release"("id") ON DELETE CASCADE ON UPDATE CASCADE;
