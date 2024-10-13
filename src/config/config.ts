import { registerAs } from '@nestjs/config';

export default registerAs('Config', () => {
  return {
    database: {
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT, 10),
      dbName: process.env.POSTGRES_DB,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
    },
    auth: {
      secret: process.env.SECRET,
      googleClientId: process.env.GOOGLE_CLIENT_ID,
      googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
      googleOAuthCallbackUrl: process.env.GOOGLE_OAUTH_CALLBACK_URL,
    },
    storage: {
      publicDomain: process.env.STORAGE_PUBLIC_DOMAIN,
      cloudflareAccessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
      cloudflareSecretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
      cloudflareEndpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
      cloudflareBucket: process.env.CLOUDFLARE_R2_BUCKET,
    },
  };
});
