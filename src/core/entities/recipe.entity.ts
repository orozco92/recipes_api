import { Difficulties } from '../enums/difficulties.enum';
import { Ingredient } from './ingredient.entity';
import { Step } from './step.entity';
import { User } from './user.entity';

export class Recipe {
  id: number;
  picture: string;
  servings: number;
  difficulty: Difficulties;
  calories: number;
  rating: number;
  ingredients: Ingredient[];
  steps: Step[];
  author: User;
}
