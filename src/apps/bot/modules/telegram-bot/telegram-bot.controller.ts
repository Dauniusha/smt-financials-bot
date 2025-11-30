import { Controller, Inject, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { Bot, webhookCallback } from 'grammy';
import { BOT_INJECT_TOKEN } from './grammy-bot/grammy-bot.constants';

@Controller()
export class TelegramBotController {
  constructor(@Inject(BOT_INJECT_TOKEN) public readonly bot: Bot) {}

  @Post()
  async handleWebhook(@Req() req: Request, @Res() res: Response) {
    const callback = webhookCallback(this.bot, 'express');
    return callback(req, res);
  }
}
