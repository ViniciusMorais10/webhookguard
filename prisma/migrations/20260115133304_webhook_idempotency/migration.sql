/*
  Warnings:

  - A unique constraint covering the columns `[source,eventId]` on the table `webhookEvent` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "webhookEvent_source_eventId_key" ON "webhookEvent"("source", "eventId");
