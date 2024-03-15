import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { ReqUser } from '../types';

export const GetUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): ReqUser =>
    context.switchToHttp().getRequest().user,
);
