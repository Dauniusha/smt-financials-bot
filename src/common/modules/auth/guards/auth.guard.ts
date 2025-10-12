import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CustomUserBlockedException } from 'src/common/exceptions/user-blocked.exception';
import { RequestWithTelegramId } from '../../../base-classes/request';
import { CustomException } from '../../../exceptions/custom.exception';
import { AuthService } from '../services/auth.service';

@Injectable()
export class TelegramAuthGuard implements CanActivate {
  constructor(private readonly _authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithTelegramId>();
    const headers = request.headers;
    const payloadStr: string = headers['initdata'];

    try {
      const user = await this._authService.authorize(payloadStr);

      request.telegramId = user.telegram_user_id;
      request.user = user;

      return true;
    } catch (err) {
      if (err instanceof CustomUserBlockedException) {
        throw new UnauthorizedException({
          message: err.message,
          data: err.data,
        });
      }

      throw new UnauthorizedException({
        message: (<CustomException>err).message,
      });
    }
  }
}
