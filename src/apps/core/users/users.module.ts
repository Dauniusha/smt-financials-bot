import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersRepo } from './repositories';
import { TypeOrmUsersRepo } from './repositories/typeorm-users.repository';
import { User } from './entities/user';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [{ provide: UsersRepo, useClass: TypeOrmUsersRepo }],
  exports: [UsersRepo],
})
export class UsersModule {}
