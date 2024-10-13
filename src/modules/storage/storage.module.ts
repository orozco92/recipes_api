import { Module } from '@nestjs/common';
import { R2StorageService } from './r2-storage.service';

@Module({
  imports: [],
  controllers: [],
  providers: [R2StorageService],
  exports: [R2StorageService],
})
export class StorageModule {}
