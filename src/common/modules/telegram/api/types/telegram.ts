export type TelegarmChatMemberStatus =
  | 'member'
  | 'left'
  | 'creator'
  | 'administrator'
  | 'restricted'
  | 'kicked';

export type TelegramChatMember = {
  status: TelegarmChatMemberStatus;
  user: unknown;
};

export type TelegramUserRaw = {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  photo_url: string;
  is_premium?: true;
  language_code?: string;
};

export type TelegramPayloadRaw = {
  query_id: string;
  user: string;
  hash: string;
  auth_date: number;
};

export type TelegramPayload = TelegramUserRaw & {
  hash: string;
  auth_date: number;
};

export class TelegramUser {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  photoUrl: string;
  isPremium?: boolean;
  languageCode?: string;

  fromTelegramPayload(telegramPayload: TelegramPayload): TelegramUser {
    const user = new TelegramUser();
    user.id = telegramPayload.id;
    user.firstName = telegramPayload.first_name;
    user.lastName = telegramPayload.last_name;
    user.username = telegramPayload.username;
    user.photoUrl = telegramPayload.photo_url;
    user.isPremium = !!telegramPayload.is_premium;
    user.languageCode = telegramPayload.language_code;
    return user;
  }
}
