-- AlterTable
ALTER TABLE "User" ADD COLUMN     "token" VARCHAR(50);

-- AlterTable
ALTER TABLE "Vacancy" ADD COLUMN     "technologiesQuestionsCount" INTEGER[];

-- CreateTable
CREATE TABLE "QuestionStats" (
    "questionId" INTEGER NOT NULL,
    "tries" INTEGER NOT NULL DEFAULT 0,
    "success" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "QuestionStats_pkey" PRIMARY KEY ("questionId")
);

-- AddForeignKey
ALTER TABLE "QuestionStats" ADD CONSTRAINT "QuestionStats_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
