import { Global, Module } from '@nestjs/common';
import { TelegramBotController } from './telegram-bot.controller';
import { ConfigurableModuleClass } from './telegram-bot.module.builder';
import { botProvider } from './grammy-bot';

@Global()
@Module({
  imports: [],
  providers: [botProvider],
  exports: [botProvider],
  controllers: [TelegramBotController],
})
export class TelegramBotModule extends ConfigurableModuleClass {}
