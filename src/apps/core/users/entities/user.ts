import { mainLocale } from '@common/localization/locales';
import { randomUUID } from 'node:crypto';

export enum UserRole {
  Admin = 'admin',
  User = 'user',
}

export class User {
  static createUser(userData: {
    telegramId: string;
    locale?: string;
    username: string;
    name: string;
  }) {
    const user = new User();
    user.id = randomUUID();
    user.telegramId = Number(userData.telegramId);
    user.username = userData.username;
    user.locale = userData.locale ?? mainLocale;
    user.name = userData.name;
    user.role = UserRole.User;
    return user;
  }

  id: string;
  telegramId: number;
  username: string;
  locale: string;
  name: string;
  role: UserRole;
}
