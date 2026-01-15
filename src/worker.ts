import 'dotenv/config';

import axios from 'axios';
import { Worker } from 'bullmq';
import { WEBHOOK_QUEUE_NAME } from './queue/webhook.queue';
import { PrismaClient, WebhookStatus } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) throw new Error('DATABASE_URL is not set');

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const redisUrl = process.env.REDIS_URL;
if (!redisUrl) throw new Error('REDIS_URL is not set');

const destination = process.env.WEBHOOK_DESTINATION_URL;
if (!destination) throw new Error('WEBHOOK_DESTINATION_URL is not set');

const worker = new Worker(
  WEBHOOK_QUEUE_NAME,
  async (job) => {
    const { webhookEventId } = job.data;

    const event = await prisma.webhookEvent.findUnique({
      where: {
        id: webhookEventId,
      },
    });

    if (!event) return;

    await prisma.webhookEvent.update({
      where: {
        id: webhookEventId,
      },
      data: {
        status: WebhookStatus.PROCESSING,
      },
    });

    try {
      await axios.post(destination, {
        source: event.source,
        payload: event.payload,
        eventId: event.eventId,
      });

      await prisma.webhookEvent.update({
        where: {
          id: webhookEventId,
        },
        data: {
          status: WebhookStatus.DELIVERED,
          lastError: null,
        },
      });

      return;
    } catch (error) {
      const msg = error?.message ?? 'Unknown error';

      await prisma.webhookEvent.update({
        where: {
          id: webhookEventId,
        },
        data: {
          status: WebhookStatus.FAILED,
          attempts: { increment: 1 },
          lastError: msg,
        },
      });

      throw error;
    }
  },
  {
    connection: {
      url: redisUrl,
    },
  },
);

worker.on('ready', () => {
  console.log('WebhookGuard Worker is ready');
});

worker.on('failed', (job, err) => {
  console.log('Job failed', job?.id, err.message);
});

worker.on('completed', (job) => {
  console.log('Job completed', job?.id);
});
