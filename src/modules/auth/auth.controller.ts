import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { SignUpDto } from './dtos/sign-up.dto';
import { SignInDto } from './dtos/sign-in.dto';
import { ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { ThrottleConfig } from '../../config/throttle.config';

@Controller('auth')
@ApiTags('auth')
@Throttle({ default: ThrottleConfig.short })
export class AuthController {
  constructor(private service: AuthService) {}

  @Post('signup')
  signUp(@Body() signUpDto: SignUpDto) {
    return this.service.signUp(signUpDto);
  }

  @Post('signin')
  @HttpCode(HttpStatus.ACCEPTED)
  signIn(@Body() signInDto: SignInDto) {
    return this.service.signIn(signInDto);
  }
}
