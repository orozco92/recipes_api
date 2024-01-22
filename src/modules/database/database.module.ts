import { Global, Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from '../../config/config';

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
        };
      },
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
