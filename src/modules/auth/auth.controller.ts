import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dtos/sign-up.dto';
import { SignInDto } from './dtos/sign-in.dto';

@Controller('auth')
export class AuthController {
  constructor(private service: AuthService) {}

  @Post('signup')
  signUp(@Body() signUpDto: SignUpDto) {
    console.log(111);

    return this.service.signUp(signUpDto);
  }

  @Post('signin')
  @HttpCode(HttpStatus.ACCEPTED)
  signIn(@Body() signInDto: SignInDto) {
    return this.service.signIn(signInDto);
  }
}
