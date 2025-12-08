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

  // CORS - Allow mobile and admin
  app.enableCors({
    origin: true, // Allow all origins for development
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  });

  // Global prefix
  app.setGlobalPrefix('api/v1');

  // Swagger documentation
  setupSwagger(app);

  // Listen on all network interfaces (0.0.0.0) to allow access from mobile devices
  await app.listen(3010, '0.0.0.0');
  console.log(`Application is running on: http://0.0.0.0:3010`);
  console.log(`Local access: http://localhost:3010`);
  console.log(`Network access: http://192.168.1.4:3010 (your IP)`);
  console.log(`Swagger documentation: http://localhost:3010/api/docs`);
  console.log(`GraphQL endpoint: http://localhost:3010/graphql`);
}
bootstrap();