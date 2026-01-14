import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { WebhookStatus } from '@prisma/client';

@Injectable()
export class WebhooksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(source: string, payload: any) {
    const eventId =
      (typeof payload?.eventId === 'string' && payload.eventId) ||
      (typeof payload?.id === 'string' && payload.id) ||
      null;

    const event = await this.prisma.webhookEvent.create({
      data: {
        source,
        eventId,
        payload,
        status: WebhookStatus.RECEIVED,
      },
      select: { id: true, status: true },
    });
    return event;
  }
}
