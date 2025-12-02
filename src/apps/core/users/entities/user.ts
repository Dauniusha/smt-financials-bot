import { mainLocale } from '@common/localization/locales';
import { randomUUID } from 'node:crypto';
import { Entity, Column, PrimaryColumn } from 'typeorm';

export enum UserRole {
  Admin = 'admin',
  User = 'user',
}

@Entity('users')
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

  @PrimaryColumn('uuid')
  id: string;

  @Column({ name: 'telegram_id', unique: true })
  telegramId: number;

  @Column()
  username: string;

  @Column()
  locale: string;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.User })
  role: UserRole;
}
