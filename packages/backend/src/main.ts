import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

/**
 * WHAT: Application entry point that bootstraps the NestJS application
 * 
 * WHY: Centralized bootstrap allows configuration of global pipes, middleware,
 * and error handling before the application starts listening for requests
 * 
 * HOW: Creates NestJS application instance, configures global validation,
 * CORS, and starts the HTTP server
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // WHY: ConfigService provides type-safe access to environment variables
  const configService = app.get(ConfigService);

  // WHY: Global prefix groups all routes under /api for clear API boundaries
  app.setGlobalPrefix('api');

  // WHY: Global validation pipe automatically validates all incoming DTOs
  // This ensures data integrity and reduces boilerplate in controllers
  app.useGlobalPipes(
    new ValidationPipe({
      // WHY: Whitelist strips unknown properties from DTOs (security)
      whitelist: true,
      // WHY: ForbidNonWhitelisted throws error if unknown properties are sent
      forbidNonWhitelisted: true,
      // WHY: Transform automatically converts plain objects to DTO instances
      transform: true,
      // WHY: TransformOptions enables automatic type conversion
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // WHY: CORS configuration allows frontend to make requests from different origin
  // In production, this should be restricted to specific origins
  const corsOrigin = configService.get<string>('CORS_ORIGIN', 'http://localhost:5173');
  app.enableCors({
    origin: corsOrigin,
    credentials: true, // WHY: Allows cookies to be sent with requests
  });

  const port = configService.get<number>('PORT', 3000);
  await app.listen(port);

  // WHY: Console log helps developers know the server started successfully
  console.log(`Application is running on: http://localhost:${port}/api`);
}

bootstrap();

