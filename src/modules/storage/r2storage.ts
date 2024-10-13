import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Request } from 'express';
import { randomBytes } from 'node:crypto';
import { Readable } from 'stream';

export class CloudflareR2Storage {
  client: S3Client;
  bucketName: string;
  endpoint: string;
  getFileName: FileNameType = () =>
    new Promise<string>((resolve, reject) => {
      randomBytes(16, function (err, raw) {
        if (err) reject(err);
        else resolve(raw.toString('hex'));
      });
    });

  constructor(options: CloudflareR2StorageOptions) {
    const { endpoint, accessKeyId, secretAccessKey, bucket } = options;

    if (!endpoint || !accessKeyId || !secretAccessKey)
      throw new Error(
        'R2 endpoint, access key id and secret access key are required',
      );
    if (!bucket) throw new Error('R2 bucket name is required');

    this.endpoint = endpoint;
    this.bucketName = bucket;

    this.client = new S3Client({
      region: 'auto',
      endpoint: endpoint,
      credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
      },
    });

    if (options.fileName && 'function' === typeof options.fileName)
      this.getFileName = options.fileName;
  }

  _handleFile(
    req: Request,
    file: Express.Multer.File,
    cb: (error?: any, info?: Partial<Express.Multer.File>) => void,
  ) {
    this.uploadFile(req, file)
      .then((data) => {
        cb(null, data);
      })
      .catch((err) => {
        cb(err, file);
      });
  }

  _removeFile(
    req: Request,
    file: Express.Multer.File,
    cb: (error?: any, info?: Partial<Express.Multer.File>) => void,
  ) {
    if (!file.filename) cb(null, file);
    this.client
      .send(
        new DeleteObjectCommand({
          Key: file.filename,
          Bucket: this.bucketName,
        }),
      )
      .then(() => {
        delete file.filename;
        cb(null);
      })
      .catch((err) => cb(err));
  }

  private async uploadFile(
    req: Request,
    file: Express.Multer.File,
  ): Promise<Partial<Express.Multer.File>> {
    const filename = await this.getFileName(req, file);
    const buffer = await this.streamToBuffer(file.stream);

    const command = new PutObjectCommand({
      Key: filename,
      Bucket: this.bucketName,
      Body: buffer,
      ContentType: file.mimetype,
    });
    await this.client.send(command);
    return {
      filename,
    };
  }

  private async streamToBuffer(stream: Readable) {
    const chunks = [];
    for await (const chunk of stream) {
      chunks.push(chunk);
    }
    return Buffer.concat(chunks);
  }
}

export type FileNameType = (
  req: Request,
  file: Express.Multer.File,
) => Promise<string>;

export interface CloudflareR2StorageOptions {
  endpoint: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
  fileName?: FileNameType;
}
