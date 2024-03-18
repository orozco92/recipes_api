import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Recipe } from './recipe.entity';
import { Auditable } from './auditable.entity';
import { IsNumber, IsString } from 'class-validator';

/**
 * Step
 **/
@Entity('steps')
export class Step extends Auditable {
  @PrimaryGeneratedColumn()
  id: number;

  @IsNumber()
  @Column({ name: 'number', type: 'int' })
  number: number;

  @IsString()
  @Column({ name: 'description', type: 'text' })
  description: string;

  @ManyToOne(() => Recipe, (recipe) => recipe.steps)
  @JoinColumn({ name: 'recipe_id' })
  recipe: Recipe;
}
