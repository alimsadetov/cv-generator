/*
  Warnings:

  - The `technologies` column on the `Question` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Question" DROP COLUMN "technologies",
ADD COLUMN     "technologies" TEXT[];

-- AlterTable
ALTER TABLE "Vacancy" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT false;
