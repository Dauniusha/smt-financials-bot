import { User } from '../entities/user';

export abstract class UsersRepo {
  abstract getByTelegramId(id: number): Promise<User>;
}
