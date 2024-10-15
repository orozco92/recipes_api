import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { User } from './core/entities';
import { Logger } from '@nestjs/common';
import helmet from 'helmet';
import { requestLogger } from './core/middlewares/request-logger';
import { DetailedValidationPipe } from './core/pipes/detailed-validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // swagger config
  const config = new DocumentBuilder()
    .setTitle('Recipes API')
    .setDescription(
      'API for queriying cooking recipes. Colaborators can create new recipes. Authenticated users will be able to rate any recipes.',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'security module')
    .addTag('recipes', 'recipes module crud opperations')
    .addTag('profile', 'auth user profile actions')
    .addTag('users', 'user module crud opperations')
    .build();
  const document = SwaggerModule.createDocument(app, config, {
    extraModels: [User],
  });
  SwaggerModule.setup('docs', app, document);

  // security config
  app.use(helmet());
  app.use(helmet.xPoweredBy());
  app.enableCors();

  app.useGlobalPipes(
    new DetailedValidationPipe({
      transform: true,
      enableDebugMessages: true,
    }),
  );

  app.use(requestLogger);

  const port = process.env.PORT;
  await app.listen(port);
  Logger.log(`Application started at port ${port}`, 'Application');
}
bootstrap();
