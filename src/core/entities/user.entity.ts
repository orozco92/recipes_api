import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Rating } from './rating.entity';
import { Recipe } from './recipe.entity';

/**
 * User
 **/
@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'username', type: 'varchar', length: 255 })
  username: string;

  @Column({ name: 'email', type: 'varchar', length: 255 })
  email: string;

  @Column({ name: 'role', type: 'varchar', length: 255 })
  role: string;

  @Column({ name: 'password', type: 'varchar', length: 255 })
  password: string;

  @OneToMany(() => Recipe, (recipe) => recipe.author)
  recipes: Recipe[];

  @OneToMany(() => Rating, (rating) => rating.user)
  ratings: Rating[];

  @ManyToMany(() => Recipe)
  @JoinTable({
    name: 'favorites',
    joinColumn: {
      name: 'user',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'recipe',
      referencedColumnName: 'id',
    },
  })
  favorites: Recipe[];
}
