-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "claps" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "followersCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "followingCount" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "UserRelation" (
    "followerId" TEXT NOT NULL,
    "followingId" TEXT NOT NULL,

    CONSTRAINT "UserRelation_pkey" PRIMARY KEY ("followerId","followingId")
);

-- CreateIndex
CREATE INDEX "UserRelation_followerId_idx" ON "UserRelation"("followerId");

-- CreateIndex
CREATE INDEX "UserRelation_followingId_idx" ON "UserRelation"("followingId");
