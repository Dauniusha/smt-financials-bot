export type TTelegarmChatMemberStatus =
  | 'member'
  | 'left'
  | 'creator'
  | 'administrator'
  | 'restricted'
  | 'kicked';

export type TTelegramChatMember = {
  status: TTelegarmChatMemberStatus;
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

export type TTelegramPayloadRaw = {
  query_id: string;
  user: string;
  hash: string;
  auth_date: number;
};

export type TTelegramPayload = TelegramUserRaw & {
  hash: string;
  auth_date: number;
};
