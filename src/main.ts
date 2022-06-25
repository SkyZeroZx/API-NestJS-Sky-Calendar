import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { initSwagger } from './app.swagger';
import * as cors from "cors";
import helmet from "helmet";
import webpush from './config/webpush';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger(bootstrap.name);

  // Habilitamos la whitelist con ValidationPipe al inicializar nuestra API
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  app.use(cors());
  app.use(helmet());
  // Inicializamos Swagger
  initSwagger(app);
  await app.listen(process.env.PORT || 3000);

  webpush();

  logger.log(`El servidor se ejecuta en ${await app.getUrl()}`);
}
bootstrap();
