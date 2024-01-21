import { OmitType } from '@nestjs/swagger';
import { User } from '../../../core/entities';

export class UserDto extends OmitType(User, ['password'] as const) {}
