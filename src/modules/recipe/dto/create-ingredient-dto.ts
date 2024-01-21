import { OmitType } from '@nestjs/swagger';
import { Ingredient } from '../../../core/entities';

export class CreateIngredientDto extends OmitType(Ingredient, ['id']) {}
