import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Recipe } from './recipe.entity';

/**
 * Step
 **/
@Entity('steps')
export class Step {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'number', type: 'int' })
  number: number;

  @Column({ name: 'description', type: 'text' })
  description: string;

  @ManyToOne(() => Recipe, (recipe) => recipe.steps)
  recipe: Recipe;
}
