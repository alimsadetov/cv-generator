-- CreateTable
CREATE TABLE "UserInterviewLimits" (
    "userId" INTEGER NOT NULL,
    "limit" SMALLINT NOT NULL DEFAULT 3,
    "remain" SMALLINT NOT NULL DEFAULT 3,

    CONSTRAINT "UserInterviewLimits_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Profile" (
    "userId" INTEGER NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "phone" TEXT,
    "tgUsername" TEXT,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "VacancyStats" (
    "vacancyId" INTEGER NOT NULL,
    "successTries" INTEGER NOT NULL DEFAULT 0,
    "totalTries" INTEGER NOT NULL DEFAULT 0,
    "failedTries" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "VacancyStats_pkey" PRIMARY KEY ("vacancyId")
);

-- AddForeignKey
ALTER TABLE "UserInterviewLimits" ADD CONSTRAINT "UserInterviewLimits_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VacancyStats" ADD CONSTRAINT "VacancyStats_vacancyId_fkey" FOREIGN KEY ("vacancyId") REFERENCES "Vacancy"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
