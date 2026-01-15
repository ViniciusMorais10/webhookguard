import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, WebhookStatus } from '@prisma/client';

@Injectable()
export class WebhooksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(source: string, payload: any, key: string) {
    const eventId =
      (typeof payload?.eventId === 'string' && payload.eventId) ||
      (typeof payload?.id === 'string' && payload.id) ||
      (typeof key === 'string' && key.trim()) ||
      null;

    if (eventId) {
      const existing = await this.prisma.webhookEvent.findUnique({
        where: {
          source_eventId: { source, eventId },
        },
        select: { id: true, status: true },
      });

      if (existing) {
        return existing;
      }
    }

    try {
      return await this.prisma.webhookEvent.create({
        data: {
          source,
          eventId,
          payload,
          status: WebhookStatus.RECEIVED,
        },
        select: { id: true, status: true },
      });
    } catch (error) {
      if (
        eventId &&
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        const existing = await this.prisma.webhookEvent.findUnique({
          where: {
            source_eventId: { source, eventId },
          },
          select: { id: true, status: true },
        });

        if (existing) {
          return existing;
        }
      }
    }
  }
}
