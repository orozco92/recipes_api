import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import config from '../../../config/config';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../../core/entities';
import { Repository } from 'typeorm';
import { JwtTokenPayload } from '../../../core/interfaces/jwt-token-payload.interface';
import { ReqUser } from '../../../core/types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @Inject(config.KEY) configService: ConfigType<typeof config>,
    @InjectRepository(User) private repo: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.auth.secret,
    });
  }

  async validate(payload: JwtTokenPayload) {
    const user = await this.repo.findOneBy({ username: payload.username });
    if (!user) throw new UnauthorizedException();
    const reqUser: ReqUser = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    };
    return reqUser;
  }
}
