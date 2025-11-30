import { Bot, Composer } from 'grammy';
import { PATH_METADATA } from '@nestjs/common/constants';
import { Logger, Provider } from '@nestjs/common';
import { TelegramBotController } from '../telegram-bot.controller';
import { TelegramBotModuleOptions } from '../types';
import { MODULE_OPTIONS_TOKEN } from '../telegram-bot.module.builder';
import { BOT_INJECT_TOKEN } from './grammy-bot.constants';

export const USE_WEBHOOKS = process.env.APP_NODE_ENV !== 'local';

export const composer = new Composer();

export const botProvider: Provider = {
  provide: BOT_INJECT_TOKEN,
  useFactory: async ({
    webhookUrl,
    token,
    config,
  }: TelegramBotModuleOptions): Promise<Bot> => {
    const logger = new Logger('TelegramBot');

    const { pathname } = new URL(webhookUrl);
    Reflect.defineMetadata(PATH_METADATA, pathname, TelegramBotController);
    logger.verbose(`TelegramBotController got path=${pathname}`);

    const bot = new Bot(token, config);

    if (USE_WEBHOOKS) {
      logger.verbose('Will use webhooks for telegram bot');
    } else {
      logger.warn(
        'Will use default way of handling telegram bot updates (NO_WEBHOOKS)',
      );
      bot.use(composer);
      bot.start({
        onStart: (info) => {
          logger.verbose(`GrammyBot started. BotUsername=${info.username}`);
        },
      });
    }

    return bot;
  },
  inject: [MODULE_OPTIONS_TOKEN],
};
