import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { User } from './core/entities';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';

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
    .addTag('users', 'user module crud opperations')
    .addTag('recipes', 'recipes module crud opperations')
    .build();
  const document = SwaggerModule.createDocument(app, config, {
    extraModels: [User],
  });
  SwaggerModule.setup('docs', app, document);

  // security config
  app.use(helmet());
  app.use(helmet.xPoweredBy());

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  await app.listen(3000);
}
bootstrap();
