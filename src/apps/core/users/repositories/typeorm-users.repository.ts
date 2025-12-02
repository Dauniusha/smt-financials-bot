import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../entities/user';
import { UsersRepo } from './users.repository';

@Injectable()
export class TypeOrmUsersRepo implements UsersRepo {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getByTelegramId(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { telegramId: id } });
  }

  async createUser(user: User): Promise<void> {
    await this.userRepository.save(user);
  }

  async getAdmins(): Promise<User[]> {
    return this.userRepository.find({ where: { role: UserRole.Admin } });
  }
}
