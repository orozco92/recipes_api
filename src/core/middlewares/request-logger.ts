import { Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  Logger.debug(JSON.stringify(req.query, null, 2), 'Query');
  if (['POST', 'PUT', 'PATCH'].includes(req.method))
    Logger.debug(JSON.stringify(req.body, null, 2), 'Body');
  next();
}
