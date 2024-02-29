import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ListResponseDto } from '../../core/models/list-response';
import { User } from '../../core/entities';
import { UserDto } from './dto/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { PagedAndSortedRequest } from '../../core/models/list-request';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  create(createUserDto: CreateUserDto): Promise<UserDto> {
    const user = this.repo.create(createUserDto);
    return this.repo.save(user);
  }

  async findAll(
    options: PagedAndSortedRequest,
  ): Promise<ListResponseDto<User>> {
    const query: FindManyOptions<User> = {
      skip: options.offset,
      take: options.limit,
      select: ['id', 'email', 'username', 'role'],
    };
    query.order = options.sort?.reduce((p, c) => (p[c[0]] = c[1]), {});
    return {
      data: await this.repo.find(query),
      total: await this.repo.count(query),
      limit: options.limit,
      offset: options.offset,
    };
  }

  async findOne(id: number): Promise<UserDto> {
    const instance = await this.repo.findOneBy({ id });
    if (instance) {
      delete instance.password;
    }
    return instance;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<UserDto> {
    const instance = await this.repo.findOneBy({ id });
    this.repo.merge(instance, updateUserDto);
    return this.repo.save(instance);
  }

  async remove(id: number): Promise<UserDto> {
    const instance = await this.repo.findOneBy({ id });
    delete instance.password;
    if (!instance) throw new BadRequestException(`User not found for id=${id}`);
    await this.repo.delete(id);
    return instance;
  }
}
