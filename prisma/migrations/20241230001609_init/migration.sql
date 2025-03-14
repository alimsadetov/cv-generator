-- CreateEnum
CREATE TYPE "role" AS ENUM ('superadmin', 'user');

-- CreateEnum
CREATE TYPE "Lang" AS ENUM ('ru', 'en');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "chatId" VARCHAR(50),
    "username" VARCHAR(255),
    "email" VARCHAR(255),
    "passwordHash" TEXT,
    "role" "role" NOT NULL DEFAULT 'user',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RefreshToken" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userAgent" TEXT NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vacancy" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "lang" "Lang" NOT NULL,
    "level" INTEGER NOT NULL,
    "description" TEXT,
    "questionsCount" INTEGER NOT NULL,
    "technologies" TEXT[],

    CONSTRAINT "Vacancy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(255) NOT NULL,
    "answer" TEXT NOT NULL,
    "lang" "Lang" NOT NULL,
    "level" INTEGER NOT NULL,
    "mainTechnology" TEXT NOT NULL,
    "technologies" TEXT NOT NULL,
    "importance" INTEGER NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
