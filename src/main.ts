import { ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { setupSwagger } from './config/swagger.config';

const rateLimit = require('express-rate-limit');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global pipes - UPDATED to be less strict on query parameters
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false, // CHANGED: Allow extra properties in query
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // ... rest of your bootstrap code remains the same
  // Global filters
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global interceptors
  app.useGlobalInterceptors(new LoggingInterceptor());

  // Global guards
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector));

  // Rate limiting
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100,
      message: 'Too many requests from this IP, please try again later.',
    })
  );

  // CORS
  app.enableCors();

  // Global prefix
  app.setGlobalPrefix('api/v1');

  // Swagger documentation
  setupSwagger(app);

  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
  console.log(`Swagger documentation: ${await app.getUrl()}/api/docs`);
}
bootstrap();