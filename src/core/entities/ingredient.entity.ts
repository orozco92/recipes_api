import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Recipe } from './recipe.entity';
import { Auditable } from './auditable.entity';
import { IsString } from 'class-validator';

/**
 * Ingredient
 **/
@Entity('ingredients')
export class Ingredient extends Auditable {
  @PrimaryGeneratedColumn()
  id: number;

  @IsString()
  @Column({ name: 'name', type: 'varchar', length: 255 })
  name: string;

  @IsString()
  @Column({ name: 'amount', type: 'varchar', length: 255, nullable: true })
  amount?: string;

  @IsString()
  @Column({ name: 'unit', type: 'varchar', length: 255, nullable: true })
  unit?: string;

  @ManyToOne(() => Recipe, (recipe) => recipe.ingredients)
  @JoinColumn({ name: 'recipe_id' })
  recipe: Recipe;
}
