import { Injectable, Logger } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { Bot, Context } from 'grammy';
import { BotCommand } from 'grammy/types';
import { CustomBadRequestException } from '@common/exceptions/custom-bad-request.exception';
import { Command, Handler } from '.';
import * as Commands from './commands';
import * as Handlers from './handlers';
import * as Callbacks from './callbacks';
import { GBot, on } from '../telegram-bot';
import {
  CallbackHandler,
  CallbackType,
} from 'src/apps/bot/modules/actions/types/callback';
import { InternalException } from '@common/exceptions';

@Injectable()
export class ActionsService {
  private readonly logger = new Logger(ActionsService.name);

  private readonly commands = new Map<string, Command>();
  private readonly handlers: Handler[] = [];
  private readonly callbacks = new Map<string, CallbackHandler>();

  constructor(
    @GBot() private readonly bot: Bot,
    private moduleRef: ModuleRef,
  ) {}

  async bootstrap() {
    this.logger.verbose(`Will bootstrap ${ActionsService.name}`);
    for (const commandInjectToken of Object.values(Commands)) {
      const command: Command = this.moduleRef.get(commandInjectToken);
      this.commands.set(command.name, command);
    }

    for (const handlerInjectToken of Object.values(Handlers)) {
      this.handlers.push(this.moduleRef.get(handlerInjectToken));
    }

    for (const callbackInjectToken of Object.values(Callbacks)) {
      const callback: CallbackHandler = this.moduleRef.get(callbackInjectToken);
      this.callbacks.set(callback.type, callback);
    }

    const internalCommands = Array.from(this.commands.values()).filter(
      (command) => command.isVisible,
    );
    const commandsFormattedForTelegram: BotCommand[] = internalCommands.map(
      (cmd) => ({ command: cmd.name, description: cmd.description }),
    );
    await this.bot.api.setMyCommands(commandsFormattedForTelegram);

    on(this.bot, 'msg::bot_command', (ctx) => this.handleCommand(ctx));
    on(this.bot, 'message', (ctx) => this.handleMessage(ctx));
    on(this.bot, 'callback_query', (ctx) => this.handleCallback(ctx));
  }

  private async handleCommand(ctx: Context) {
    try {
      if (!ctx.message?.text) {
        return;
      }

      const command = ctx.message.text.slice(1).split(' ')[0];
      this.logger.verbose(`Got command=${command}`);

      const commandData = this.commands.get(command);
      if (!commandData) return;

      await commandData.execute(ctx);
    } catch (err) {
      if (err instanceof CustomBadRequestException) {
        await ctx.reply(err.message, { parse_mode: 'HTML' });
        return;
      }

      this.logger.error(`Error during command execution:`);
      this.logger.error(err);
    }
  }

  private async handleMessage(ctx: Context) {
    this.logger.verbose(
      `Got message='${ctx.message.text}' chatId=${ctx.chat.id}`,
    );

    for (const handler of this.handlers) {
      try {
        await handler.handleMessage(ctx);
      } catch (err) {
        if (err instanceof CustomBadRequestException) {
          await ctx.reply(err.message, { parse_mode: 'HTML' });
          return;
        }

        this.logger.error(`Error during message handler execution:`);
        this.logger.error(err);
      }
    }
  }

  private async handleCallback(ctx: Context) {
    this.logger.verbose(
      `Got message='${ctx.callbackQuery}' chatId=${ctx.chat.id}`,
    );

    const callbackPayload = JSON.parse(ctx.callbackQuery.data) as {
      type?: CallbackType;
    };
    console.log(callbackPayload);

    if (!callbackPayload.type) {
      throw new InternalException('Callback type was not found');
    }

    const callback = this.callbacks.get(callbackPayload.type);

    if (!callback) {
      throw new InternalException(
        `Handler for type ${callbackPayload.type} was not found`,
      );
    }

    try {
      await callback.handle(callbackPayload, ctx);
    } catch (err) {
      this.logger.error(`Error during callback handler execution:`);
      this.logger.error(err);
    }
  }
}
