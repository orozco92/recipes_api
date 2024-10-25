import { MigrationInterface, QueryRunner } from 'typeorm';
import { RecipeDifficulty } from '../../core/enums';
import { MealType } from '../../core/enums/meal-type.enum';
import { CreateRecipeDto } from '../../modules/recipe/dto/create-recipe.dto';
import { CreateIngredientDto } from '../../modules/recipe/dto/create-ingredient-dto';
import { CreateStepDto } from '../../modules/recipe/dto/create-step-dto';

type CreateRecipeType = Partial<CreateRecipeDto> & {
  createdAt: Date;
  updatedAt: Date;
};

export class Recipes1724077239466 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const userQueryResult = await queryRunner.query(
      'SELECT * from USERS ORDER BY RANDOM() LIMIT 1;',
      undefined,
      true,
    );
    const user = userQueryResult.records[0];

    const recipes: (CreateRecipeType & {
      ingredients: CreateIngredientDto[];
      steps: CreateStepDto[];
    })[] = [
      {
        name: 'Pan Fried Tilapia',
        servings: 3,
        cookingTime: 13,
        calories: 249,
        mealType: MealType.Lunch,
        difficulty: RecipeDifficulty.Beginner,
        ingredients: [
          {
            name: 'Tilapia fillets',
            amount: '3',
            unit: 'ounces',
          },
          {
            name: 'Olive oil',
            amount: '2',
            unit: 'tbsp',
          },
          {
            name: 'Smoked paprika',
            amount: '1/2',
            unit: 'tsp',
          },
          {
            name: 'Garlic powder',
            amount: '1/2',
            unit: 'tsp',
          },
          {
            name: 'Salt',
            amount: '1/2',
            unit: 'tsp',
          },
          {
            name: 'Ground black pepper',
            amount: '1/2',
            unit: 'tsp',
          },
        ],
        steps: [
          {
            number: 1,
            description:
              'Using paper towels, pat the fish completely dry, this will help with browning.',
          },
          {
            number: 2,
            description:
              'Drizzle the tilapia with 1 tablespoon of olive oil and seasoning with smoked paprika, garlic powder, salt and pepper on both sides. Use a brush or your hands to distribute the seasonings evenly.',
          },
          {
            number: 3,
            description:
              'Heat a non stick pan over medium high heat, heat oil – when it’s hot, and add the tilapia fillets. Work in batches if needed.',
          },
          {
            number: 4,
            description:
              'Sear for 3-4 minutes per side until the fish is opaque and cooked through. Use a fish spatula to carefully remove from pan as it’s a flaky fish and can easily break. Cover with foil to keep warm until you’re ready to serve.',
          },
        ],
        authorId: user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Tortilla francesa tradicional',
        difficulty: RecipeDifficulty.Beginner,
        cookingTime: 5,
        servings: 1,
        ingredients: [
          {
            name: 'Huevo',
            amount: '3',
          },
          {
            name: 'Aceite de oliva',
            amount: '10',
            unit: 'ml',
          },
          {
            name: 'Sal',
          },
        ],
        steps: [
          {
            number: 1,
            description:
              'Elegimos un plato hondo para batir los huevos, que sea lo suficientemente profundo como para poder inclinarlo ligeramente sin salpicar.',
          },
          {
            number: 2,
            description:
              'Cascamos los huevos y los echamos en el plato. Si tenemos dudas de si están frescos hacemos un paso intermedio para comprobarlo: llenamos un vaso con agua del tiempo y sumergimos los huevos uno a uno, si se van al fondo están perfectos, en caso de que floten los descartamos inmediatamente.',
          },
          {
            number: 3,
            description:
              'Espolvoreamos una pizca de sal sobre el plato. Removemos enérgicamente con la ayuda de un tenedor hasta tener una mezcla uniforme, no deberíamos ver restos de las claras.',
          },
          {
            number: 4,
            description:
              'Ponemos una sartén a fuego medio-alto y echamos un chorro de aceite de oliva virgen extra. Dejamos calentar.',
          },
          {
            number: 5,
            description:
              'Comprobamos que el aceite está caliente: tomamos un poco de huevo batido con la punta del tenedor y lo dejamos caer en la sartén, si empieza a dorarse inmediatamente ya tenemos la temperatura adecuada.',
          },
          {
            number: 6,
            description:
              'Echamos los huevos batidos y cubrimos todo el fondo. Dejamos que cuaje. Cuando la parte inferior ha cuajado doblamos la tortilla a la mitad con la ayuda de una paleta de cocina muy fina. Hacemos una especie de media luna y aplastamos ligeramente con la paleta.',
          },
          {
            number: 7,
            description:
              'Dejamos medio minuto y damos la vuelta, dejando que se haga medio minuto más por el otro lado. Retiramos a un plato y servimos inmediatamente.',
          },
        ],
        authorId: user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    let header =
      'INSERT INTO RECIPES (name, servings, cooking_time, calories, difficulty, meal_type, author_id, picture, created_at, updated_at) VALUES ';
    let values = recipes.map(
      (item) => `(
    '${item.name}',
     ${item.servings ?? null}, 
     ${item.cookingTime ?? null}, 
     ${item.calories ?? null}, 
     '${item.difficulty}', 
     ${!!item.mealType ? "'" + item.mealType + "'" : null}, 
     ${item.authorId}, 
     '', 
     '${item.createdAt.toISOString()}', 
     '${item.updatedAt.toISOString()}'
    )\n`,
    );

    await this.executeQuery(queryRunner, header, values);
    const result = await queryRunner.query(
      `SELECT id, name from RECIPES WHERE created_at in (${recipes.map((it) => `'${it.createdAt.toISOString()}'`).join(', ')});`,
      undefined,
      true,
    );

    const recipesDb = result.records;

    header = 'INSERT INTO INGREDIENTS (name, amount, unit, recipe_id) VALUES ';
    values = recipes.map((recipe) => {
      const id = recipesDb.find((item) => item.name === recipe.name).id;
      return recipe.ingredients
        .map(
          (item) => `(
            '${item.name}',
            ${!!item.amount ? "'" + item.amount + "'" : null}, 
            ${!!item.unit ? "'" + item.unit + "'" : null},
            ${id})\n`,
        )
        .join(',');
    });

    await this.executeQuery(queryRunner, header, values);

    header = 'INSERT INTO STEPS (number, description, recipe_id) VALUES ';
    values = recipes.map((recipe) => {
      const id = recipesDb.find((item) => item.name === recipe.name).id;
      return recipe.steps
        .map(
          (item) => `(
                '${item.number}',
                '${item.description}',
                ${id})\n`,
        )
        .join(',');
    });

    await this.executeQuery(queryRunner, header, values);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DELETE FROM INGREDIENTS;');
    await queryRunner.query('DELETE FROM STEPS;');
    await queryRunner.query('DELETE FROM RECIPES;');
  }

  private async executeQuery(
    queryRunner: QueryRunner,
    statement: string,
    values: string[],
  ) {
    return queryRunner.query(statement + values.join(',') + ';');
  }
}
