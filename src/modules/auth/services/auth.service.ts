import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { SignUpDto } from '../dtos/sign-up.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../core/entities';
import { Roles } from '../../../core/enums';
import { genSalt, hash, compare } from 'bcrypt';
import { DbErrorCodes } from '../../../core/enums/db-error-codes.enum';
import { SignInDto } from '../dtos/sign-in.dto';
import { DUPLICATED_USER, INVALID_CREDENTIALS } from '../../../core/constants';
import { JwtService } from '@nestjs/jwt';
import { JwtTokenPayload } from '../../../core/interfaces/jwt-token-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private repo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    const user: User = this.repo.create(signUpDto);
    user.role = Roles.Customer;
    user.salt = await genSalt();
    user.password = await hash(signUpDto.password, user.salt);

    try {
      await this.repo.save(user);
    } catch (error) {
      if (error.code == DbErrorCodes.DuplicateEntity) {
        throw new ConflictException(DUPLICATED_USER);
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async signIn(signInDto: SignInDto) {
    const user = await this.repo.findOneBy({ username: signInDto.username });
    if (!user) throw new UnauthorizedException(INVALID_CREDENTIALS);
    const match = await compare(signInDto.password, user.password);
    if (!match) throw new UnauthorizedException(INVALID_CREDENTIALS);
    const payload: JwtTokenPayload = {
      username: user.username,
      role: user.role,
    };
    const accestoken = this.jwtService.sign(payload);
    return { accestoken };
  }
}
