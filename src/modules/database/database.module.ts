import { Global, Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from '../../config/config';
import { Ingredient, Rating, Recipe, Step, User } from '../../core/entities';

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
          synchronize: true,
          autoLoadEntities: true,
          entities: [User, Recipe, Ingredient, Step, Rating],
        };
      },
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
