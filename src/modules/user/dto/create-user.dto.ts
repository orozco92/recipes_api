import { OmitType } from '@nestjs/swagger';
import { User } from '../../../core/entities';

export class CreateUserDto extends OmitType(User, [
  'id',
  'ratings',
  'recipes',
  'favorites',
  'role',
  'createdAt',
  'updatedAt',
] as const) {}
