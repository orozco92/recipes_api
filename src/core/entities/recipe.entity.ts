import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { PrimaryGeneratedColumn } from 'typeorm';
import { Ingredient } from './ingredient.entity';
import { Step } from './step.entity';
import { User } from './user.entity';

/**
 * Recipe
 **/
@Entity('recipes')
export class Recipe {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name', type: 'varchar', length: 255 })
  name: string;

  @Column({ name: 'picture', type: 'varchar', length: 255, nullable: true })
  picture: string;

  @Column({ name: 'cooking_time', type: 'integer', nullable: true })
  cookingTime: number;

  @Column({ name: 'servings', type: 'integer', nullable: true })
  servings: number;

  @Column({ name: 'difficulty', type: 'varchar', length: 255, nullable: true })
  difficulty: string;

  @Column({ name: 'calories', type: 'integer', nullable: true })
  calories: number;

  @Column({
    name: 'rating',
    type: 'decimal',
    precision: 2,
    scale: 1,
    default: 0,
  })
  rating: number;

  @ManyToOne(() => User, (user) => user.recipes)
  author: User;

  @OneToMany(() => Ingredient, (ingredient) => ingredient.recipe, {
    cascade: true,
  })
  ingredients: Ingredient[];

  @OneToMany(() => Step, (step) => step.recipe, { cascade: true })
  steps: Step[];
}
