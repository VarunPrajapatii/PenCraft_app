/*
  Warnings:

  - Changed the type of `content` on the `Blog` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Blog" ADD COLUMN     "bannerImageUrl" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "published" BOOLEAN NOT NULL DEFAULT false,
DROP COLUMN "content",
ADD COLUMN     "content" JSONB NOT NULL,
ALTER COLUMN "publishedDate" DROP DEFAULT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "totalClaps" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "userProfileImageUrl" TEXT DEFAULT '';
