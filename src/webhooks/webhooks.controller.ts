import {
  Body,
  Controller,
  Headers,
  HttpCode,
  Param,
  Post,
} from '@nestjs/common';
import { WebhooksService } from './webhooks.service';

@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}
  @Post('/:source')
  @HttpCode(202)
  async create(
    @Param('source') source: string,
    @Body() payload: any,
    @Headers('X-Idempotency-Key') key?: any,
  ) {
    return await this.webhooksService.create(source, payload, key);
  }
}
