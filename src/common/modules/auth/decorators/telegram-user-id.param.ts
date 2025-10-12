import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { RequestWithTelegramId } from '../../../base-classes/request';

export const TelegramUserId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest<RequestWithTelegramId>();
    return request.telegramId;
  },
);
