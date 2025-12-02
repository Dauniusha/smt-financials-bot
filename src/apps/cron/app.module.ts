import { Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { LOGGER_CONFIG } from '@common/configs';
import { GlobalConfigModule } from '@common/modules/config/global-config.module';
import { DatabaseModule } from '@common/modules/database/database.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TelegramBotModule } from 'src/apps/bot/modules/telegram-bot/telegram-bot.module';
import { ConfigService } from '@nestjs/config';
import { ITelegramConfig } from '@common/configs/telegram.config';
import { TelegramBotModuleOptions } from 'src/apps/bot/modules/telegram-bot/types';
import { ConfigNames } from '@common/types/enums/configNames.enum';

@Module({
  controllers: [],
  imports: [
    WinstonModule.forRoot(LOGGER_CONFIG),
    GlobalConfigModule,
    DatabaseModule,
    ScheduleModule.forRoot(),
    TelegramBotModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService): TelegramBotModuleOptions => {
        const { botToken, webhookUrl } =
          configService.getOrThrow<ITelegramConfig>(ConfigNames.TELEGRAM);
        return {
          token: botToken,
          webhookUrl: webhookUrl,
        };
      },
    }),
  ],
})
export class AppModule {}
