import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { RequestWithTelegramId } from '../../../base-classes/request';

export const TelegramUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): unknown => {
    const request = ctx.switchToHttp().getRequest<RequestWithTelegramId>();
    return request.user;
  },
);
