import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { RequestWithTelegramId } from '../../../base-classes/request';
import { TelegramUser } from '../api/types/telegram';

export const TgUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): TelegramUser => {
    const request = ctx.switchToHttp().getRequest<RequestWithTelegramId>();
    return request.user;
  },
);
