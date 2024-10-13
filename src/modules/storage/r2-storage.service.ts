import { Inject, Injectable } from '@nestjs/common';
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import config from '../../config/config';
import { ConfigType } from '@nestjs/config';
import { Readable } from 'stream';

@Injectable()
export class R2StorageService {
  client: S3Client;
  bucket: string;
  constructor(@Inject(config.KEY) configService: ConfigType<typeof config>) {
    this.bucket = configService.storage.cloudflareBucket;
    this.client = new S3Client({
      region: 'auto',
      endpoint: configService.storage.cloudflareEndpoint,
      credentials: {
        accessKeyId: configService.storage.cloudflareAccessKeyId,
        secretAccessKey: configService.storage.cloudflareSecretAccessKey,
      },
    });
  }

  async uploadFile(key: string, stream: Readable, contentType?: string) {
    const chunks = [];
    for await (const chunk of stream) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);
    return this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: buffer,
        ContentType: contentType,
      }),
    );
  }

  async removeFile(key: string) {
    return this.client.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      }),
    );
  }
}
