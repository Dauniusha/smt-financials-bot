import { Module } from '@nestjs/common';
import { TelegramApiService } from './api/telegram-api.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  providers: [TelegramApiService],
  imports: [DatabaseModule],
  exports: [TelegramApiService],
})
export class TelegramModule {}
