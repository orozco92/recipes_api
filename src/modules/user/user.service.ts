import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ListResponseDto } from '../../core/models/list-response';
import { User } from '../../core/entities';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  create(createUserDto: CreateUserDto): UserDto {
    return null;
  }

  findAll(): ListResponseDto<User> {
    return null;
  }

  findOne(id: number): UserDto {
    return null;
  }

  update(id: number, updateUserDto: UpdateUserDto): UserDto {
    return null;
  }

  remove(id: number): UserDto {
    return null;
  }
}
