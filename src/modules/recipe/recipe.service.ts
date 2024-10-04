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
import { FindManyOptions, ILike, Repository } from 'typeorm';
import { ReqUser } from '../../core/types';
import { ListRecipeRequest } from './dto/list-recipe-request';

@Injectable()
export class RecipeService {
  constructor(@InjectRepository(Recipe) private repo: Repository<Recipe>) {}

  create(createRecipeDto: CreateRecipeDto, user: ReqUser): Promise<Recipe> {
    const recipe = this.repo.create(createRecipeDto);
    recipe.author = user as User;
    return this.repo.save(recipe);
  }

  async findAll(
    options: ListRecipeRequest,
  ): Promise<ListResponseDto<ListRecipeDto>> {
    const { page, pageSize, difficulty, mealType, search } = options;
    const query: FindManyOptions<Recipe> = {
      skip: (page - 1) * pageSize,
      take: pageSize ? pageSize : 20,
      where: {},
    };

    if (mealType) query.where['mealType'] = mealType;
    if (difficulty) query.where['difficulty'] = difficulty;
    if (search) query.where['name'] = ILike(`%${search}%`);

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
