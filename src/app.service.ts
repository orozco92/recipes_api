import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): { data: string } {
    return {
      data: 'Welcome to recipes API v1.0',
    };
  }
}
