import { Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  Logger.debug(req.url, 'URL');
  // Logger.debug(JSON.stringify(req.headers, null, 2), 'Headers');
  Logger.debug(JSON.stringify(req.query, null, 2), 'Query');
  if (['POST', 'PUT', 'PATCH'].includes(req.method))
    Logger.debug(JSON.stringify(req.body, null, 2), 'Body');
  next();
}
