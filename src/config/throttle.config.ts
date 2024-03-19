import { ThrottlerOptions, seconds } from '@nestjs/throttler';

export const ThrottleConfig: Record<
  string,
  Readonly<Pick<ThrottlerOptions, 'limit' | 'ttl'>>
> = {
  default: {
    ttl: seconds(60),
    limit: 60,
  },
  short: {
    ttl: seconds(10),
    limit: 3,
  },
  long: {
    ttl: seconds(60),
    limit: 100,
  },
};
