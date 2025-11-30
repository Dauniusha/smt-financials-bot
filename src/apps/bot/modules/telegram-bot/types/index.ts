import { BotConfig, Context } from 'grammy';

export type TelegramBotModuleOptions = {
  token: string;
  webhookUrl: string;
  config?: BotConfig<Context>;
};
