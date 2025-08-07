-- CreateTable
CREATE TABLE "public"."DemoFeedback" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "recipientEmail" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "files" JSONB NOT NULL,
    "rating" INTEGER,
    "feedback" TEXT,
    "name" TEXT,
    "submittedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DemoFeedback_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DemoFeedback_token_key" ON "public"."DemoFeedback"("token");

-- CreateIndex
CREATE INDEX "DemoFeedback_recipientEmail_idx" ON "public"."DemoFeedback"("recipientEmail");

-- CreateIndex
CREATE INDEX "DemoFeedback_createdAt_idx" ON "public"."DemoFeedback"("createdAt");
