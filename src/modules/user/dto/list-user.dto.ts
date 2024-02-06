import { OmitType } from '@nestjs/swagger';
import { User } from '../../../core/entities';

export class ListUserDto extends OmitType(User, [
  'password',
  'ratings',
  'recipes',
  'favorites',
] as const) {}
