/*
  Warnings:

  - The `status` column on the `webhookEvent` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Made the column `updatedAt` on table `webhookEvent` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "WebhookStatus" AS ENUM ('RECEIVED', 'PROCESSING', 'DELIVERED', 'FAILED');

-- AlterTable
ALTER TABLE "webhookEvent" DROP COLUMN "status",
ADD COLUMN     "status" "WebhookStatus" NOT NULL DEFAULT 'RECEIVED',
ALTER COLUMN "attempts" SET DEFAULT 0,
ALTER COLUMN "lastError" DROP NOT NULL,
ALTER COLUMN "receivedAt" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "updatedAt" SET NOT NULL;

-- DropEnum
DROP TYPE "WebHookStatus";
