/*
  Warnings:

  - You are about to drop the column `bannerImageUrl` on the `Blog` table. All the data in the column will be lost.
  - You are about to drop the column `userProfileImageUrl` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Blog" DROP COLUMN "bannerImageUrl",
ADD COLUMN     "bannerImageKey" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "userProfileImageUrl",
ADD COLUMN     "profileImageKey" TEXT DEFAULT '';
