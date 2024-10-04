import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../core/entities';
import { Repository } from 'typeorm';

@Injectable()
export class ProfileService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  me(
    id: number,
  ): Promise<
    Pick<
      User,
      | 'id'
      | 'username'
      | 'email'
      | 'firstName'
      | 'lastName'
      | 'picture'
      | 'role'
      | 'favorites'
    >
  > {
    return this.userRepo.findOne({
      where: { id },
      select: [
        'id',
        'username',
        'email',
        'firstName',
        'lastName',
        'picture',
        'role',
        'favorites',
      ],
      relations: { favorites: true },
    });
  }
}
