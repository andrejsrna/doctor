-- AlterTable
ALTER TABLE "public"."News" ADD COLUMN     "categories" TEXT[] DEFAULT ARRAY[]::TEXT[];
