import { SetMetadata } from '@nestjs/common';
import { Roles } from '../enums';

export const ROLES_KEY = 'role-decorator';
export const Role = (...roles: Roles[]) => SetMetadata(ROLES_KEY, roles);
