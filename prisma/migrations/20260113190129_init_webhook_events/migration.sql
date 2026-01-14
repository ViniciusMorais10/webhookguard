-- CreateEnum
CREATE TYPE "WebHookStatus" AS ENUM ('received', 'processing', 'delivered', 'failed');

-- CreateTable
CREATE TABLE "webhookEvent" (
    "id" SERIAL NOT NULL,
    "source" TEXT NOT NULL,
    "eventId" TEXT,
    "payload" JSONB NOT NULL,
    "status" "WebHookStatus" NOT NULL,
    "attempts" INTEGER NOT NULL,
    "lastError" TEXT NOT NULL,
    "receivedAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "webhookEvent_pkey" PRIMARY KEY ("id")
);
