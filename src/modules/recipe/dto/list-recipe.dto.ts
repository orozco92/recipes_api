import { OmitType } from '@nestjs/swagger';
import { Recipe } from '../../../core/entities';

export class ListRecipeDto extends OmitType(Recipe, [
  'author',
  'ingredients',
  'steps',
  'favoriteOf',
]) {}
