import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Recipe } from './recipe.entity';

/**
 * Ingredient
 **/
@Entity('ingredients')
export class Ingredient {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name', type: 'varchar', length: 255 })
  name: string;

  @Column({ name: 'amount', type: 'varchar', length: 255, nullable: true })
  amount?: string;

  @Column({ name: 'unit', type: 'varchar', length: 255, nullable: true })
  unit?: string;

  @ManyToOne(() => Recipe, (recipe) => recipe.ingredients)
  recipe: Recipe;
}
