import { InternalException } from '@common/exceptions';
import { getTranslate } from '@common/localization/get-translate';
import { FinancialService } from '@core/financial/financial.service';
import { Injectable, Logger } from '@nestjs/common';
import { Bot, Context } from 'grammy';
import {
  CallbackHandler,
  CallbackType,
} from 'src/apps/bot/modules/actions/types/callback';
import { GBot } from 'src/apps/bot/modules/telegram-bot';

export type RejectFinances = {
  type: CallbackType.ApproveFinances;
  requestId: number;
};

@Injectable()
export class RejectFinancesCallback implements CallbackHandler {
  readonly type = CallbackType.RejectFinances;
  readonly logger = new Logger(RejectFinancesCallback.name);

  constructor(
    @GBot() private readonly bot: Bot,
    private readonly financialService: FinancialService,
  ) {}

  async handle(payload: RejectFinances, ctx: Context) {
    const tgUser = ctx?.from;
    if (!tgUser) return;

    const telegramUserId = tgUser.id;
    const requestId = payload.requestId;
    if (!requestId) {
      throw new InternalException('Financial request id was not provided');
    }
    const request = await this.financialService.reviewRequest(
      requestId,
      false,
      telegramUserId,
    );

    const userReplyMessage = getTranslate(
      'rejectRequestNotification',
      request.user.locale,
      { purpose: request.purpose, reviewer: `@${request.reviewer.username}` },
    );
    const adminReplyMessage = getTranslate(
      'adminRejectRequestNotification',
      request.reviewer.locale,
      { purpose: request.purpose, requester: `@${request.reviewer.username}` },
    );
    await Promise.all([
      this.bot.api.sendMessage(request.reviewer.telegramId, adminReplyMessage, {
        parse_mode: 'HTML',
      }),
      this.bot.api.sendMessage(request.user.telegramId, userReplyMessage, {
        parse_mode: 'HTML',
      }),
    ]);
  }
}
