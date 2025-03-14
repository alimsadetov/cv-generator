/*
  Warnings:

  - Added the required column `isResponseFromGptReceived` to the `QuestionAnswer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maxScore` to the `QuestionAnswer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "QuestionAnswer" ADD COLUMN     "isResponseFromGptReceived" BOOLEAN NOT NULL,
ADD COLUMN     "maxScore" INTEGER NOT NULL;
