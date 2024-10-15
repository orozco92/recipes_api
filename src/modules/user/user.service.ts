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
    const { page, pageSize } = options;
    const query: FindManyOptions<User> = {
      skip: (page - 1) * pageSize,
      take: pageSize ? +pageSize : 20,
      select: [
        'id',
        'email',
        'username',
        'role',
        'firstName',
        'lastName',
        'enabled',
      ],
    };
    query.order = options.sort?.reduce((p, c) => (p[c[0]] = c[1]), {});
    const data = await this.repo.find(query);
    const total = await this.repo.count(query);
    const totalPages = Math.ceil(total / pageSize);
    return {
      data,
      total,
      pageSize,
      page,
      totalPages,
    };
  }

  async findOne(id: number): Promise<UserDto> {
    const instance = await this.repo.findOneBy({ id });
    if (!instance) throw new BadRequestException(`User not found for id=${id}`);
    delete instance.password;
    delete instance.salt;
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

  async enableUser(id: number) {
    const success = await this.setEnableStatus(id, true);
    return { status: success ? 'SUCCESS' : 'FAILED' };
  }

  async disableUser(id: number) {
    const success = await this.setEnableStatus(id, false);
    return { status: success ? 'SUCCESS' : 'FAILED' };
  }

  async resetPassword(id: number) {
    return { status: 'SUCCESS' };
  }

  private async setEnableStatus(id: number, enabled: boolean) {
    const instance = await this.repo.findOneBy({ id });
    if (!instance) throw new BadRequestException(`User not found for id=${id}`);
    if (instance.enabled === enabled) return false;
    const result = await this.repo.update(instance.id, { enabled });
    return result.affected > 0;
  }
}
