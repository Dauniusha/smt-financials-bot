import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TelegramAuthGuard } from './guards/auth.guard';
import { AuthService } from './services/auth.service';
import { TelegramAuthService } from './services/telegram.service';
import { ClsModule } from 'nestjs-cls';

@Global()
@Module({
  controllers: [],
  providers: [TelegramAuthGuard, AuthService, TelegramAuthService],
  imports: [JwtModule.register({}), ClsModule],
  exports: [TelegramAuthGuard, AuthService, TelegramAuthService],
})
export class AuthModule {}
