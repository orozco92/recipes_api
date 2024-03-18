import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { Recipe, User } from '../../core/entities';
import { ListResponseDto } from '../../core/models/list-response';
import { ListRecipeDto } from './dto/list-recipe.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { PagedAndSortedRequest } from '../../core/models/list-request';
import { ReqUser } from '../../core/types';

@Injectable()
export class RecipeService {
  constructor(@InjectRepository(Recipe) private repo: Repository<Recipe>) {}

  create(createRecipeDto: CreateRecipeDto, user: ReqUser): Promise<Recipe> {
    const recipe = this.repo.create(createRecipeDto);
    recipe.author = user as User;
    return this.repo.save(recipe);
  }

  async findAll(
    options: PagedAndSortedRequest,
  ): Promise<ListResponseDto<ListRecipeDto>> {
    const query: FindManyOptions<Recipe> = {
      skip: options.offset ? +options.offset : 0,
      take: options.limit ? +options.limit : 20,
    };
    query.order = options.sort?.reduce((p, c) => (p[c[0]] = c[1]), {});
    return {
      data: await this.repo.find(query),
      total: await this.repo.count(query),
      limit: query.take,
      offset: query.skip,
    };
  }

  findOne(id: number): Promise<Recipe> {
    return this.repo.findOne({
      where: { id },
      relations: {
        author: true,
        ingredients: true,
        steps: true,
      },
    });
  }

  async update(
    id: number,
    updateRecipeDto: UpdateRecipeDto,
    user: ReqUser,
  ): Promise<Recipe> {
    const instance = await this.findAndCheckUser(id, user);
    this.repo.merge(instance, updateRecipeDto);
    return this.repo.save(instance);
  }

  async remove(id: number, user: ReqUser): Promise<Recipe> {
    const instance = await this.findAndCheckUser(id, user);
    await this.repo.delete(instance.id);
    return instance;
  }

  async findAndCheckUser(id: number, user: ReqUser) {
    const instance = await this.repo.findOneBy({ id });
    if (!instance)
      throw new BadRequestException(`Recipe not found for id=${id}`);
    if (instance.authorId !== user.id) throw new ForbiddenException();
    return instance;
  }
}
