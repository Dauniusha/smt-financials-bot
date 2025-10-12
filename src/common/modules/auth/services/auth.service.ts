import { Inject, Injectable } from '@nestjs/common';
import * as qs from 'qs';
import { TelegramAuthService } from './telegram.service';
import { ConfigNames } from '../../../types/enums/configNames.enum';
import { CustomException } from '../../../exceptions/custom.exception';
import { TelegramUserRaw, TTelegramPayloadRaw } from '../types';
import { TelegramUserPayload } from '@common/types/telegram-user-payload';

@Injectable()
export class AuthService {
  constructor(private readonly _telegramAuthService: TelegramAuthService) {}

  public async authorize(tgDataSrt: string): Promise<any> {
    //if (this._config.isNeedCheckTgPayload) {
    if (true) {
      const validTelegramPayload =
        this._telegramAuthService.checkIsValidTelegramPayload(tgDataSrt);
      if (!validTelegramPayload) {
        throw new CustomException('Invalid credentials');
      }
    }

    try {
      const payload = this.parseFromTgString(tgDataSrt);
      const user = await this.getOrCreateUser(payload);

      if (!user) throw new CustomException('Invalid credentials');

      //this._eventBus.publish(new UserAuthenticatedEvent({ user, payload }));

      return user;
    } catch (e) {
      if (e instanceof CustomException) throw e;
      throw new CustomException('Invalid credentials');
    }
  }

  private async getOrCreateUser(payload: TelegramUserPayload): Promise<any> {
    return {};

    // const getUserQuery = new GetUserQuery({
    //   telegramUserId: payload.telegram_user_id,
    //   throw: false,
    //   useCache: true,
    // });

    // const existed = await this._queryBus.execute<GetUserQuery, UserEntity>(
    //   getUserQuery,
    // );

    // if (existed) return existed;

    // return await this._commandBus.execute(new CreateUserCommand({ payload }));
  }

  private mapToTgUserPayload({
    id,
    username,
    language_code,
    first_name,
    is_premium,
  }: TelegramUserRaw): TelegramUserPayload {
    return {
      telegram_user_id: id.toString(),
      username: username ? username : '' + id,
      language_code: language_code || 'en',
      telegram_name: first_name,
      is_premium: !!is_premium,
    };
  }

  private parseFromTgString(tgDataString: string): TelegramUserPayload {
    const userString = (
      qs.parse(tgDataString) as unknown as TTelegramPayloadRaw
    ).user;
    const rawTgUser = JSON.parse(userString);
    return this.mapToTgUserPayload(rawTgUser);
  }
}
