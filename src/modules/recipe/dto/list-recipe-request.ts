import { ApiProperty } from '@nestjs/swagger';
import { PagedAndSortedRequest } from '../../../core/models/list-request';
import { MealType } from '../../../core/enums/meal-type.enum';
import { RecipeDifficulty } from '../../../core/enums';

export class ListRecipeRequest extends PagedAndSortedRequest {
  @ApiProperty({
    enum: MealType,
    enumName: 'MealType',
    required: false,
  })
  mealType?: MealType;

  @ApiProperty({
    enum: RecipeDifficulty,
    enumName: 'RecipeDifficulty',
    required: false,
  })
  difficulty?: RecipeDifficulty;
}
