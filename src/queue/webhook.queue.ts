import { Queue } from 'bullmq';

export const WEBHOOK_QUEUE_NAME = 'webhook_events';

export function getWebhookQueue() {
  const connection = process.env.REDIS_URL;

  if (!connection) {
    throw new Error('REDIS_URL is not set');
  }

  return new Queue(WEBHOOK_QUEUE_NAME, {
    connection: {
      url: connection,
    },
  });
}
