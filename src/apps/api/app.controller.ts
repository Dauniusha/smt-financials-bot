import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ThrottlerBehindProxyGuard } from '@common/throttler/throttler-behind-proxy.guard';
import { seconds, Throttle } from '@nestjs/throttler';

@ApiTags('Healthcheck')
@Controller()
export class AppController {
  @Get('/health')
  @UseGuards(ThrottlerBehindProxyGuard)
  @Throttle({ default: { limit: 1, ttl: seconds(1) } })
  @HttpCode(HttpStatus.OK)
  healthCheck() {
    return { status: 'Working' };
  }
}
