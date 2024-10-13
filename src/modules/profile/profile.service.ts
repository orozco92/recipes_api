import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Recipe, User } from '../../core/entities';
import { Repository } from 'typeorm';
import { UpdateProfileDto } from './dtos/update-profile.dto';
import { UpdatePasswordDto } from './dtos/update-password.dto';
import { INVALID_CREDENTIALS } from '../../core/constants';
import { compare, hash } from 'bcrypt';
import { R2StorageService } from '../storage/r2-storage.service';
import config from '../../config/config';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Recipe) private recipeRepo: Repository<Recipe>,
    @Inject(config.KEY) private configService: ConfigType<typeof config>,
    private storageService: R2StorageService,
  ) {}

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

  async getFavoriteIds(userId: number) {
    try {
      const user = await this.userRepo.findOne({
        select: { favorites: { id: true } },
        where: { id: userId },
        relations: { favorites: true },
      });
      if (!user)
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      return user.favorites?.map((item) => item.id);
    } catch (error) {
      throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async addToFavorites(userId: number, recipeId: number) {
    try {
      const user = await this.userRepo.findOne({
        select: { favorites: { id: true } },
        where: { id: userId },
        relations: { favorites: true },
      });
      const recipe = await this.recipeRepo.findOneBy({ id: recipeId });
      if (!user || !recipe)
        throw new HttpException('Recipe not found', HttpStatus.NOT_FOUND);
      user.favorites.push(recipe);
      await this.userRepo.save(user);
    } catch (error) {
      throw new HttpException(
        'Error adding to favorites',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async removeFromFavorites(userId: number, recipeId: number) {
    try {
      const user = await this.userRepo.findOne({
        select: { favorites: { id: true } },
        where: { id: userId },
        relations: { favorites: true },
      });
      const recipe = await this.recipeRepo.findOneBy({ id: recipeId });
      if (!user || !recipe)
        throw new HttpException('Recipe not found', HttpStatus.NOT_FOUND);

      user.favorites = user.favorites.filter((item) => item.id !== recipeId);
      await this.userRepo.save(user);
    } catch (error) {
      throw new HttpException(
        'Error adding to favorites',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateProfileData(
    data: UpdateProfileDto,
    userId: number,
  ): Promise<
    Pick<
      User,
      'id' | 'username' | 'email' | 'firstName' | 'lastName' | 'picture'
    >
  > {
    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) throw new HttpException('Invalid user', HttpStatus.NOT_FOUND);
    await this.userRepo.update(user.id, data);

    return this.me(user.id);
  }

  async resetPassword(
    resetPasswordDto: UpdatePasswordDto,
    userId: number,
  ): Promise<void> {
    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) throw new UnauthorizedException(INVALID_CREDENTIALS);
    const match = await compare(resetPasswordDto.oldPassword, user.password);
    if (!match) throw new UnauthorizedException(INVALID_CREDENTIALS);
    user.password = await hash(resetPasswordDto.newPassword, user.salt);
    await this.userRepo.save(user);
  }

  async updateProfilePicture(userId: number, filename: string) {
    const user = await this.userRepo.findOneBy({ id: userId });

    if (user.picture) await this.removeOldPicture(user.picture);

    const picture = `${this.configService.storage.publicDomain}/${filename}`;
    await this.userRepo.update(user.id, { picture });

    return this.me(userId);
  }

  async removeOldPicture(oldName: string) {
    const key = oldName.replace(
      this.configService.storage.publicDomain + '/',
      '',
    );
    return this.storageService.removeFile(key);
  }
}
