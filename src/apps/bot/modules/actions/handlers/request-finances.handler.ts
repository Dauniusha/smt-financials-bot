import { CustomBadRequestException } from '@common/exceptions/custom-bad-request.exception';
import { getTranslate } from '@common/localization/get-translate';
import { mainLocale } from '@common/localization/locales';
import { FinancialService } from '@core/financial/financial.service';
import { UsersRepo } from '@core/users/repositories';
import { Injectable, Logger } from '@nestjs/common';
import Bluebird from 'bluebird';
import { Bot, Context, InlineKeyboard } from 'grammy';
import { CallbackType } from 'src/apps/bot/modules/actions/types/callback';
import { Handler } from 'src/apps/bot/modules/actions/types/handler';
import { GBot } from 'src/apps/bot/modules/telegram-bot';

@Injectable()
export class RequestFinancesHandler implements Handler {
  readonly logger = new Logger(RequestFinancesHandler.name);

  constructor(
    @GBot() private readonly bot: Bot,
    private readonly financialService: FinancialService,
    private readonly usersRepo: UsersRepo,
  ) {}

  async handleMessage(ctx: Context) {
    const tgUser = ctx?.from;
    if (!tgUser) return;
    const userLocale = tgUser.language_code ?? mainLocale;

    if (!ctx.message.text)
      throw new CustomBadRequestException('Invalid finance request format');

    const [request, admins] = await Promise.all([
      this.financialService.requestFinance(ctx.message.text, tgUser.id),
      this.usersRepo.getAdmins(),
    ]);

    const replyMessage = getTranslate('requestFinanceSent', userLocale);

    try {
      await ctx.reply(replyMessage, { parse_mode: 'HTML' });
      await Bluebird.map(
        admins,
        async (admin) => {
          const message = getTranslate(
            'requestFinanceAdminNotification',
            admin.locale,
            { purpose: request.purpose, user: `@${request.user.username}` },
          );

          const inlineKeyboard = new InlineKeyboard();
          inlineKeyboard.add(
            {
              text: getTranslate('approveRequestBtn', admin.locale),
              callback_data: JSON.stringify({
                type: CallbackType.ApproveFinances,
                requestId: request.id,
              }),
            },
            {
              text: getTranslate('rejectRequestBtn', admin.locale),
              callback_data: JSON.stringify({
                type: CallbackType.RejectFinances,
                requestId: request.id,
              }),
            },
          );

          this.bot.api.sendMessage(admin.telegramId, message, {
            reply_markup: inlineKeyboard,
          });
        },
        {
          concurrency: 100,
        },
      );
    } catch (e) {
      this.logger.error(`Error happened during reply. ${e}`);
    }
  }
}
