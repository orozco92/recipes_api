import { Module } from '@nestjs/common';
import { RecipeController } from './recipe.controller';
import { RecipeService } from './recipe.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recipe } from '../../core/entities';
import { AuthModule } from '../auth/auth.module';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { CloudflareR2Storage } from '../storage/r2storage';
import { StorageModule } from '../storage/storage.module';
import config from '../../config/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Recipe]),
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
  controllers: [RecipeController],
  providers: [RecipeService],
})
export class RecipeModule {}
