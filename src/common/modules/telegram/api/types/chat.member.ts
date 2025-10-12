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
