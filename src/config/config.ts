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
  };
});
