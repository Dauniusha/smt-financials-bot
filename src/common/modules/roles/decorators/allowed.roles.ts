import { SetMetadata, applyDecorators } from '@nestjs/common';
import { ROLES_METADATA_KEY } from '../../../constants/keys';

export function AllowedRoles(...roles: any[]) {
  return applyDecorators(SetMetadata(ROLES_METADATA_KEY, roles));
}
