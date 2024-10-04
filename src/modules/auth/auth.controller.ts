import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  Response,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { SignUpDto } from './dtos/sign-up.dto';
import { SignInDto } from './dtos/sign-in.dto';
import { ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { ThrottleConfig } from '../../config/throttle.config';
import { AuthGuard } from '@nestjs/passport';

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

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleOAuth() {}

  @Get('google-redirect')
  @UseGuards(AuthGuard('google'))
  async googleOAuthRedirect(@Request() req, @Response() res) {
    const jwtToken = await this.service.oauthSigning(req.user);
    return res.redirect(
      `http://localhost:5173/signin/oauth-redirect?token=${jwtToken.accessToken}`,
    );

    // switch (jwtToken.frontend) {
    //   case 'react':
    //     return res.redirect(
    //       `http://localhost:3001/oauth/callback?token=${jwtToken.accessToken}`,
    //     );
    //   case 'vue':
    //     return res.redirect(
    //       `http://localhost:3002/oauth/callback?token=${jwtToken.accessToken}`,
    //     );
    //   case 'angular':
    //     return res.redirect(
    //       `http://localhost:3003/oauth/callback?token=${jwtToken.accessToken}`,
    //     );
    //   default:
    //     return res.redirect(`/`);
    // }
  }
}
