import { registerAs } from '@nestjs/config';
import { ConfigNames } from '../types/enums/configNames.enum';

export interface ITelegramConfig {
  botToken: string;
  apiBaseUrl: string;
  authSecretKey: string;
  botUsername: string;
  webhookUrl: string;
  webAppUrl: string;
  botAppUrl: string;
  adminUsers: string;
}

const getTelegramConfig = () => {
  const props = [
    'TELEGRAM_BOT_TOKEN',
    'TELEGRAM_BOT_WEBHOOK_URL',
    'TELEGRAM_API_BASE_URL',
    'TELEGRAM_AUTH_SECRET_KEY',
    'TELEGRAM_BOT_USERNAME',
    'TELEGRAM_BOT_WEB_APP_URL',
    'TELEGRAM_BOT_WEB_APP_NAME',
    'TELEGRAM_BOT_ADMIN_USERS',
  ];

  for (const prop of props) {
    if (!process.env[prop]) {
      throw new Error(`[TelegramConfig]: variable ${prop} is not configured`);
    }
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const webhookUrl = process.env.TELEGRAM_BOT_WEBHOOK_URL;
  const apiBaseUrl = process.env.TELEGRAM_API_BASE_URL;
  const authSecretKey = process.env.TELEGRAM_AUTH_SECRET_KEY;
  const botUsername = process.env.TELEGRAM_BOT_USERNAME;
  const webAppUrl = process.env.TELEGRAM_BOT_WEB_APP_URL;
  const botAppName = process.env.TELEGRAM_BOT_WEB_APP_NAME;
  const adminUsers = process.env.TELEGRAM_BOT_ADMIN_USERS;

  const config: ITelegramConfig = {
    botToken,
    apiBaseUrl,
    authSecretKey,
    botUsername,
    webhookUrl,
    webAppUrl,
    botAppUrl: `https://t.me/${botUsername}/${botAppName}`,
    adminUsers,
  };

  return config;
};

export const telegramConfig = registerAs(
  ConfigNames.TELEGRAM,
  getTelegramConfig,
);
