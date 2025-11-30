import { Inject } from '@nestjs/common';
import { BOT_INJECT_TOKEN } from './grammy-bot.constants';

export function GBot(): ParameterDecorator {
  return Inject(BOT_INJECT_TOKEN);
}
