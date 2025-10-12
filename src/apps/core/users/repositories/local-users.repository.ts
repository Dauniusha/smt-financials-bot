import { User } from 'src/apps/core/users/entities/user';
import { UsersRepo } from './users.repository';
import { plainToInstance } from 'class-transformer';

export class LocalUsersRepo implements UsersRepo {
  private static readonly users: User[] = [
    plainToInstance(User, {
      id: '7d120038-9706-4359-bb77-170ffda678e5',
      telegramId: 854782581,
      username: 'dauniusha',
      role: 'admin',
    }),
  ];

  async getByTelegramId(id: number): Promise<User | null> {
    return LocalUsersRepo.users.find(({ telegramId }) => telegramId === id);
  }
}
