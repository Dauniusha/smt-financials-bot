import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { RequestWithTelegramId } from '../../../base-classes/request';
import { ROLES_METADATA_KEY } from '../../../constants/keys';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly _reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<RequestWithTelegramId>();
    const user = req.user;

    if (!user) {
      throw new UnauthorizedException({
        message: `Unauthorized`,
      });
    }

    const allowedRoles: any[] = this._reflector.getAllAndOverride(
      ROLES_METADATA_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!allowedRoles || allowedRoles.length === 0) {
      return true;
    }

    // const hasAllowedRole = allowedRoles.some(
    //   (allowedRole) => allowedRole === user.role,
    // );

    // if (!hasAllowedRole) {
    //   throw new ForbiddenException({
    //     message: `You don't have required roles`,
    //   });
    // }

    return true;
  }
}
