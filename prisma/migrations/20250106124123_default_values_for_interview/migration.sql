/*
  Warnings:

  - You are about to drop the column `messeging` on the `Interview` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Interview" DROP COLUMN "messeging",
ADD COLUMN     "messaging" TEXT[],
ALTER COLUMN "maxPoints" SET DEFAULT 0,
ALTER COLUMN "pointsEarned" SET DEFAULT 0,
ALTER COLUMN "score" SET DEFAULT 0;
