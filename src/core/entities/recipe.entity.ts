import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { PrimaryGeneratedColumn } from 'typeorm';
import { Ingredient } from './ingredient.entity';
import { Step } from './step.entity';
import { User } from './user.entity';
import { Auditable } from './auditable.entity';
import { IsNumber, IsObject, IsString } from 'class-validator';

/**
 * Recipe
 **/
@Entity('recipes')
export class Recipe extends Auditable {
  @PrimaryGeneratedColumn()
  id: number;

  @IsString()
  @Column({ name: 'name', type: 'varchar', length: 255 })
  name: string;

  @IsString()
  @Column({ name: 'picture', type: 'varchar', length: 255, nullable: true })
  picture: string;

  @IsNumber()
  @Column({ name: 'cooking_time', type: 'integer', nullable: true })
  cookingTime: number;

  @IsNumber()
  @Column({ name: 'servings', type: 'integer', nullable: true })
  servings: number;

  @IsString()
  @Column({ name: 'difficulty', type: 'varchar', length: 255, nullable: true })
  difficulty: string;

  @IsNumber()
  @Column({ name: 'calories', type: 'integer', nullable: true })
  calories: number;

  @IsNumber()
  @Column({
    name: 'rating',
    type: 'decimal',
    precision: 2,
    scale: 1,
    default: 0,
  })
  rating: number;

  @ManyToOne(() => User, (user) => user.recipes)
  @JoinColumn({ name: 'author_id' })
  author: User;

  @Column({ name: 'author_id' })
  authorId: number;

  @IsObject()
  @OneToMany(() => Ingredient, (ingredient) => ingredient.recipe, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  ingredients: Ingredient[];

  @IsObject()
  @OneToMany(() => Step, (step) => step.recipe, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  steps: Step[];
}
