import { Column, Entity, JoinTable, ManyToMany, Unique } from 'typeorm';
import { OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Rating } from './rating.entity';
import { Recipe } from './recipe.entity';
import { Roles } from '../enums';
import { Auditable } from './auditable.entity';
import { IsEmail, IsEnum, IsString } from 'class-validator';

/**
 * User
 **/
@Entity('users')
@Unique(['username'])
@Unique(['email'])
export class User extends Auditable {
  @PrimaryGeneratedColumn()
  id: number;

  @IsString()
  @Column({ name: 'username', type: 'varchar', length: 255 })
  username: string;

  @IsEmail()
  @Column({ name: 'email', type: 'varchar', length: 255 })
  email: string;

  @IsEnum(Roles)
  @Column({
    name: 'role',
    type: 'varchar',
    length: 255,
    default: Roles.Customer,
  })
  role: Roles;

  @IsString()
  @Column({ name: 'password', type: 'varchar', length: 255 })
  password: string;

  @IsString()
  @Column({ name: 'salt', type: 'varchar', length: 255 })
  salt: string;

  @OneToMany(() => Recipe, (recipe) => recipe.author)
  recipes: Recipe[];

  @OneToMany(() => Rating, (rating) => rating.user)
  ratings: Rating[];

  @ManyToMany(() => Recipe)
  @JoinTable({
    name: 'favorites',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'recipe_id',
      referencedColumnName: 'id',
    },
  })
  favorites: Recipe[];
}
