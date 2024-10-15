import { MigrationInterface, QueryRunner } from 'typeorm';
import { Roles } from '../../core/enums';
import { genSalt, hash } from 'bcrypt';
import { User } from '../../core/entities';
import { SignUpDto } from '../../modules/auth/dtos/sign-up.dto';

export class Users1720555596406 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const users = [
      await this.createUser(
        { username: 'admin', email: 'admin@recipes.com', password: 'password' },
        Roles.Admin,
      ),
      await this.createUser(
        {
          username: 'colaborator',
          email: 'colaborator@recipes.com',
          password: 'password',
        },
        Roles.Colaborator,
      ),
      await this.createUser(
        {
          username: 'customer',
          email: 'customer@recipes.com',
          password: 'password',
        },
        Roles.Community,
      ),
    ];
    const q = users.map(
      (
        item,
      ) => `INSERT INTO USERS (username, email, password, salt, role, created_at, updated_at)
          VALUES (
            '${item.username}',
            '${item.email}',
            '${item.password}',
            '${item.salt}', 
            '${item.role}',
            '${item.createdAt.toISOString()}',
            '${item.updatedAt.toISOString()}'
          );`,
    );
    await queryRunner.query(q.join(''));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DELETE FROM USERS;');
  }

  async createUser(signUpDto: SignUpDto, role: Roles) {
    const user: Partial<User> = {
      ...signUpDto,
      role,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    user.salt = await genSalt();
    user.password = await hash(signUpDto.password, user.salt);
    return user;
  }
}
