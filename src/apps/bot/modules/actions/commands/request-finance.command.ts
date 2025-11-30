import { getTranslate } from '@common/localization/get-translate';
import { mainLocale } from '@common/localization/locales';
import { Injectable, Logger } from '@nestjs/common';
import { Context } from 'grammy';

@Injectable()
export class RequestFinancesCommand {
  readonly name = 'request_finances';
  readonly description = 'Запросить финансы';
  readonly isVisible = true;
  readonly logger = new Logger(RequestFinancesCommand.name);

  async execute(ctx: Context) {
    const tgUser = ctx?.from;
    if (!tgUser) return;

    const locale = ctx.from?.language_code || mainLocale;
    const text = getTranslate('requestFinanceInfo', locale);

    try {
      await ctx.reply(text, { parse_mode: 'HTML' });
    } catch (e) {
      this.logger.error(`Error happened during reply. ${e}`);
    }
  }
}
