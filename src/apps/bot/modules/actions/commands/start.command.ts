import { ITelegramConfig } from '@common/configs/telegram.config';
import { getTranslate } from '@common/localization/get-translate';
import { ConfigNames } from '@common/types/enums/configNames.enum';
import { User } from '@core/users/entities/user';
import { UsersRepo } from '@core/users/repositories';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Context } from 'grammy';

@Injectable()
export class StartCommand {
  readonly name = 'start';
  readonly description = 'Запустить бота';
  readonly isVisible = true;
  readonly webAppUrl: string;
  readonly logger = new Logger(StartCommand.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly usersRepo: UsersRepo,
  ) {
    const { webAppUrl } = this.configService.getOrThrow<ITelegramConfig>(
      ConfigNames.TELEGRAM,
    );
    this.webAppUrl = webAppUrl;
  }

  async execute(ctx: Context) {
    const tgUser = ctx?.from;
    if (!tgUser) return;

    const telegramUserId = tgUser.id.toString();

    const user = User.createUser({
      username: tgUser.username,
      telegramId: telegramUserId,
      locale: ctx.from?.language_code,
      name: tgUser.first_name,
    });

    await this.usersRepo.createUser(user);

    const userName = user.name ?? `@${user.username}`;
    const text = getTranslate('welcome', user.locale, { username: userName });

    try {
      await ctx.reply(text);
    } catch (e) {
      this.logger.error(`Error happened during reply. ${e}`);
    }
  }
}
