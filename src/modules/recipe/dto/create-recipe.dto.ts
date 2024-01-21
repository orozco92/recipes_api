import { OmitType } from '@nestjs/swagger';
import { Recipe } from '../../../core/entities';
import { CreateIngredientDto } from './create-ingredient-dto';
import { CreateStepDto } from './create-step-dto';

export class CreateRecipeDto extends OmitType(Recipe, [
  'id',
  'ingredients',
  'steps',
  'author',
  'rating',
]) {
  ingredients: CreateIngredientDto[];
  steps: CreateStepDto[];
}
