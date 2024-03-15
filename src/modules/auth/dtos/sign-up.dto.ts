import { IsEmail, Matches, MaxLength, MinLength } from 'class-validator';

export class SignUpDto {
  @MinLength(4)
  @MaxLength(20)
  username: string;
  @IsEmail()
  email: string;
  @MinLength(8)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password too weak',
  })
  password: string;
}
