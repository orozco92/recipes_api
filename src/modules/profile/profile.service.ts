import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Recipe, User } from '../../core/entities';
import { Repository } from 'typeorm';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Recipe) private recipeRepo: Repository<Recipe>,
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
}
