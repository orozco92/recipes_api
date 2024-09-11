import { ApiProperty } from '@nestjs/swagger';
import { FilteredPagedAndSortedRequest } from '../../../core/models/list-request';
import { MealType } from '../../../core/enums/meal-type.enum';
import { RecipeDifficulty } from '../../../core/enums';

export class ListRecipeRequest extends FilteredPagedAndSortedRequest {
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
