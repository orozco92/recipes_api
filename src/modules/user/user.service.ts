import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { ListResponseDto } from '../../core/models/list-response';
import { User } from '../../core/entities';
import { UserDto } from './dto/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { PagedAndSortedRequest } from '../../core/models/list-request';
import { ListUserDto } from './dto/list-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async findAll(
    options: PagedAndSortedRequest,
  ): Promise<ListResponseDto<ListUserDto>> {
    const query: FindManyOptions<ListUserDto> = {
      skip: options.offset ? +options.offset : 0,
      take: options.limit ? +options.limit : 20,
      select: ['id', 'email', 'username', 'role'],
    };
    query.order = options.sort?.reduce((p, c) => ({ ...p, [c[0]]: c[1] }), {});
    return {
      data: await this.repo.find(query),
      total: await this.repo.count(query),
      limit: query.take,
      offset: query.skip,
    };
  }

  async findOne(id: number): Promise<UserDto> {
    const instance = await this.repo.findOneBy({ id });
    if (!instance) throw new BadRequestException(`User not found for id=${id}`);
    delete instance.password;
    return instance;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<UserDto> {
    const instance = await this.repo.findOneBy({ id });
    if (!instance) throw new BadRequestException(`User not found for id=${id}`);
    this.repo.merge(instance, updateUserDto);
    return this.repo.save(instance);
  }

  async remove(id: number): Promise<UserDto> {
    const instance = await this.repo.findOneBy({ id });
    if (!instance) throw new BadRequestException(`User not found for id=${id}`);
    await this.repo.delete(id);
    delete instance.password;
    return instance;
  }
}
