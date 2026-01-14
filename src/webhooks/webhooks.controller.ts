import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common';
import { WebhooksService } from './webhooks.service';

@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}
  @Post('/:source')
  @HttpCode(202)
  async create(@Param('source') source: string, @Body() payload: any) {
    return await this.webhooksService.create(source, payload);
  }
}
