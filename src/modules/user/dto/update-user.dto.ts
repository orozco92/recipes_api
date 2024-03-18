import { OmitType, PartialType } from '@nestjs/swagger';
import { User } from '../../../core/entities';

export class UpdateUserDto extends PartialType(
  OmitType(User, [
    'id',
    'ratings',
    'salt',
    'recipes',
    'favorites',
    'createdAt',
    'updatedAt',
  ] as const),
) {}
