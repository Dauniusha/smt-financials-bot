import { WinstonModule } from 'nest-winston';
import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { DatabaseModule } from '@common/modules/database/database.module';
import { GlobalConfigModule } from '@common/modules/config/global-config.module';
import { LOGGER_CONFIG } from '@common/configs';
import { TelegramBotModule } from './modules/telegram-bot/telegram-bot.module';
import { ActionsModule } from './modules/actions/actions.module';
import { ConfigService } from '@nestjs/config';
import { TelegramBotModuleOptions } from './modules/telegram-bot/types';
import { ITelegramConfig } from '@common/configs/telegram.config';
import { ConfigNames } from '@common/types/enums/configNames.enum';

@Module({
  imports: [
    WinstonModule.forRoot(LOGGER_CONFIG),
    GlobalConfigModule,
    DatabaseModule,
    ThrottlerModule.forRoot(),
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
    ActionsModule,
  ],
})
export class AppModule {}
