import { Injectable } from '@nestjs/common';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { Recipe } from '../../core/entities';
import { ListResponseDto } from '../../core/models/list-response';
import { ListRecipeDto } from './dto/list-recipe.dto';

@Injectable()
export class RecipeService {
  create(createRecipeDto: CreateRecipeDto): Recipe {
    return null;
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
