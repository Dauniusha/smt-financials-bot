import { Module } from '@nestjs/common';
import { UsersRepo } from './repositories';
import { LocalUsersRepo } from './repositories/local-users.repository';

@Module({
  imports: [],
  providers: [{ provide: UsersRepo, useClass: LocalUsersRepo }],
  exports: [UsersRepo],
})
export class UsersModule {}
