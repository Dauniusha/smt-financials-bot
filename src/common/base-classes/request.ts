import { TelegramUser } from '@common/modules/telegram/api/types/telegram';
import { Request } from 'express';

export class RequestWithTelegramId extends Request {
  telegramId: string;
  user: TelegramUser;
}
