import { UseGuards, applyDecorators } from '@nestjs/common';
import { RolesGuard } from '../guards/roles.guard';
import { TelegramAuthGuard } from '../../auth/guards/auth.guard';

export function UseRolesGuard() {
  return applyDecorators(UseGuards(TelegramAuthGuard, RolesGuard));
}
