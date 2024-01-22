import { Injectable } from '@nestjs/common';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { Recipe } from '../../core/entities';
import { ListResponseDto } from '../../core/models/list-response';
import { ListRecipeDto } from './dto/list-recipe.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class RecipeService {
  constructor(@InjectRepository(Recipe) private repo: Repository<Recipe>) {}

  create(createRecipeDto: CreateRecipeDto): Promise<Recipe> {
    const recipe = this.repo.create(createRecipeDto);
    return this.repo.save(recipe);
  }

  findAll(): ListResponseDto<ListRecipeDto> {
    return null;
  }

  findOne(id: number): Recipe {
    return null;
  }

  update(id: number, updateRecipeDto: UpdateRecipeDto): Recipe {
    return null;
  }

  remove(id: number): Recipe {
    return null;
  }
}
