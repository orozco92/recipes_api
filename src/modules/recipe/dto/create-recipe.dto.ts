import { OmitType } from '@nestjs/swagger';
import { Recipe } from '../../../core/entities';
import { CreateIngredientDto } from './create-ingredient-dto';
import { CreateStepDto } from './create-step-dto';
import { IsArray } from 'class-validator';

export class CreateRecipeDto extends OmitType(Recipe, [
  'id',
  'ingredients',
  'steps',
  'author',
  'rating',
  'picture',
  'favoriteOf',
  'createdAt',
  'updatedAt',
]) {
  @IsArray()
  ingredients: CreateIngredientDto[];
  @IsArray()
  steps: CreateStepDto[];
}
