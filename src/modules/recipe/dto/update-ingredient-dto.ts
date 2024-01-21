import { PartialType } from '@nestjs/swagger';
import { Ingredient } from '../../../core/entities';

export class UpdateIngredientDto extends PartialType(Ingredient) {}
