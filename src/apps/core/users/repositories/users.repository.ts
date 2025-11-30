import { User } from '../entities/user';

export abstract class UsersRepo {
  abstract getByTelegramId(id: number): Promise<User>;
  abstract createUser(user: User): Promise<void>;
  abstract getAdmins(): Promise<User[]>;
}
