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

export type ApproveFinances = {
  type: CallbackType.ApproveFinances;
  requestId: number;
};

@Injectable()
export class ApproveFinancesCallback implements CallbackHandler {
  readonly type = CallbackType.ApproveFinances;
  readonly logger = new Logger(ApproveFinancesCallback.name);

  constructor(
    @GBot() private readonly bot: Bot,
    private readonly financialService: FinancialService,
  ) {}

  async handle(payload: ApproveFinances, ctx: Context) {
    const tgUser = ctx?.from;
    if (!tgUser) return;

    const telegramUserId = tgUser.id;
    const requestId = payload.requestId;
    if (!requestId) {
      throw new InternalException('Financial request id was not provided');
    }
    const request = await this.financialService.reviewRequest(
      requestId,
      true,
      telegramUserId,
    );

    const userReplyMessage = getTranslate(
      'approveRequestBtn',
      request.user.locale,
      { purpose: request.purpose },
    );
    const adminReplyMessage = getTranslate(
      'adminApproveRequestNotification',
      request.reviewer.locale,
      { purpose: request.purpose },
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
