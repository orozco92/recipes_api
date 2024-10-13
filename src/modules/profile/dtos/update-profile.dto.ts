import { MaxLength, MinLength } from 'class-validator';

export class UpdateProfileDto {
  @MinLength(4)
  @MaxLength(20)
  username: string;

  firstName?: string;
  lastName?: string;
}
