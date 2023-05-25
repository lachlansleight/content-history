-- CreateEnum
CREATE TYPE "ContentType" AS ENUM ('youtube', 'spotify');

-- CreateTable
CREATE TABLE "Content" (
    "id" SERIAL NOT NULL,
    "type" "ContentType" NOT NULL,
    "title" TEXT NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "duration" DOUBLE PRECISION,
    "artistName" TEXT,
    "albumName" TEXT,
    "videoUrl" TEXT,
    "channelName" TEXT,

    CONSTRAINT "Content_pkey" PRIMARY KEY ("id")
);
