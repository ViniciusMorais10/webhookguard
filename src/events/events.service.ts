import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EventsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.webhookEvent.findMany({
      take: 20,
      orderBy: {
        receivedAt: 'desc',
      },
    });
  }

  async findOne(id: number) {
    const event = await this.prisma.webhookEvent.findUnique({ where: { id } });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return event;
  }
}
