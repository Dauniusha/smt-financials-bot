import { User, UserRole } from '../entities/user';
import { UsersRepo } from './users.repository';
import { plainToInstance } from 'class-transformer';

export class LocalUsersRepo implements UsersRepo {
  private static readonly users: User[] = [
    plainToInstance(User, {
      id: '7d120038-9706-4359-bb77-170ffda678e5',
      telegramId: 854782581,
      chatId: 854782581,
      locale: 'ru',
      username: 'dauniusha',
      name: 'Danik',
      role: 'admin',
    }),
  ];

  async getByTelegramId(id: number): Promise<User | null> {
    return LocalUsersRepo.users.find(({ telegramId }) => telegramId === id);
  }

  async createUser(user: User): Promise<void> {
    LocalUsersRepo.users.push(user);
  }

  async getAdmins(): Promise<User[]> {
    return LocalUsersRepo.users.filter((user) => user.role === UserRole.Admin);
  }
}
