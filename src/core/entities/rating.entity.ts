import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { Recipe } from './recipe.entity';

/**
 * Rating
 **/
@Entity('ratings')
export class Rating {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'rate', type: 'integer' })
  rate: number;

  @ManyToOne(() => User, (user) => user.ratings)
  user: User;

  @ManyToOne(() => Recipe)
  recipe: Recipe;
}
