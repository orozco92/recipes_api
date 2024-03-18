import { Global, Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from '../config/config';
import { Ingredient, Rating, Recipe, Step, User } from '../core/entities';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [config.KEY],
      useFactory: (configService: ConfigType<typeof config>) => {
        const { host, port, dbName, username, password } =
          configService.database;
        return {
          host,
          port,
          database: dbName,
          username,
          password,
          type: 'postgres',
          synchronize: process.env.NODE_ENV !== 'production',
          autoLoadEntities: true,
          entities: [User, Recipe, Ingredient, Step, Rating],
          logger: 'simple-console',
          logging: ['query'],
          migrations: ['src/migrations/*.ts', 'src/seeds/*.ts'],
        };
      },
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
