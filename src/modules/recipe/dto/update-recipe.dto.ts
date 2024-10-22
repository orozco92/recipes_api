import { OmitType, PartialType } from '@nestjs/swagger';
import { Recipe } from '../../../core/entities';
import { CreateIngredientDto } from './create-ingredient-dto';
import { UpdateIngredientDto } from './update-ingredient-dto';
import { UpdateStepDto } from './update-step-dto';
import { CreateStepDto } from './create-step-dto';

export class UpdateRecipeDto extends PartialType(
  OmitType(Recipe, [
    'ingredients',
    'steps',
    'author',
    'rating',
    'picture',
    'favoriteOf',
    'createdAt',
    'updatedAt',
  ]),
) {
  ingredients: (CreateIngredientDto | UpdateIngredientDto)[];
  steps: (CreateStepDto | UpdateStepDto)[];
}
