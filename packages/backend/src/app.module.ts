import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
// WHY: Import feature modules as they are created
// import { AuthModule } from './modules/auth/auth.module';

/**
 * WHAT: Root application module that ties together all feature modules
 * 
 * WHY: NestJS uses a modular architecture where each feature is a module
 * This module imports all feature modules and shared configuration
 * 
 * HOW: Uses NestJS decorators to configure the application module
 */
@Module({
  imports: [
    // WHY: ConfigModule loads environment variables from .env file
    // isGlobal: true makes it available to all modules without re-importing
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env', // WHY: Explicit path for clarity
    }),

    // WHY: MongooseModule connects to MongoDB database
    // Connection string comes from environment variables
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        const uri = configService.get<string>('MONGODB_URI');
        if (!uri) {
          throw new Error('MONGODB_URI is not defined in environment variables');
        }
        return {
          uri,
          // WHY: These options improve connection stability and performance
          retryWrites: true,
          w: 'majority',
        };
      },
      inject: [ConfigService],
      imports: [ConfigModule],
    }),

    // Feature modules will be added here
    // AuthModule,
    // EmployeesModule,
    // HRModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
