import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { Recipe } from '../../core/entities';
import { ListResponseDto } from '../../core/models/list-response';
import { ListRecipeDto } from './dto/list-recipe.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { ListRequest } from '../../core/models/list-request';

@Injectable()
export class RecipeService {
  constructor(@InjectRepository(Recipe) private repo: Repository<Recipe>) {}

  create(createRecipeDto: CreateRecipeDto): Promise<Recipe> {
    const recipe = this.repo.create(createRecipeDto);
    return this.repo.save(recipe);
  }

  async findAll(options: ListRequest): Promise<ListResponseDto<ListRecipeDto>> {
    const query: FindManyOptions<Recipe> = {
      skip: options.offset,
      take: options.limit,
    };
    query.order = options.sort?.reduce((p, c) => (p[c[0]] = c[1]), {});
    return {
      data: await this.repo.find(query),
      total: await this.repo.count(query),
      limit: options.limit,
      offset: options.offset,
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

  async update(id: number, updateRecipeDto: UpdateRecipeDto): Promise<Recipe> {
    const instance = await this.repo.findOneBy({ id });
    this.repo.merge(instance, updateRecipeDto);
    return this.repo.save(instance);
  }

  async remove(id: number): Promise<Recipe> {
    const instance = await this.repo.findOneBy({ id });
    if (!instance)
      throw new BadRequestException(`Recipe not found for id=${id}`);
    await this.repo.delete(id);
    return instance;
  }
}
