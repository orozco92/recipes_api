import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recipe, User } from '../../core/entities';
import { AuthModule } from '../auth/auth.module';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigType } from '@nestjs/config';
import config from '../../config/config';
import { CloudflareR2Storage } from '../storage/r2storage';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Recipe]),
    AuthModule,
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigType<typeof config>) => ({
        storage: new CloudflareR2Storage({
          endpoint: configService.storage.cloudflareEndpoint,
          accessKeyId: configService.storage.cloudflareAccessKeyId,
          secretAccessKey: configService.storage.cloudflareSecretAccessKey,
          bucket: configService.storage.cloudflareBucket,
        }),
      }),
      inject: [config.KEY],
    }),
    StorageModule,
  ],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}
