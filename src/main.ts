import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Recipes API')
    .setDescription(
      'API for queriying cooking recipes. Colaborators can create new recipes. Authenticated users will be able to rate any recipes.',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('users', 'user module crud opperations')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(3000);
}
bootstrap();
