import { Inject } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import config from '../../../config/config';
import { ConfigType } from '@nestjs/config';
import { OAuthUser } from '../../../core/interfaces/user-request';

export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(@Inject(config.KEY) configService: ConfigType<typeof config>) {
    super({
      clientID: configService.auth.googleClientId,
      clientSecret: configService.auth.googleClientSecret,
      callbackURL: configService.auth.googleOAuthCallbackUrl,
      scope: ['profile', 'email', 'openid'],
      userProfileUrl: 'https://www.googleapis.com/userinfo/v2/me',
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails, photos } = profile;
    const user = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos[0].value,
      accessToken,
      refreshToken,
    } as OAuthUser;
    done(null, user);
  }
}
