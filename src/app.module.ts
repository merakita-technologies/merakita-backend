// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { ConfigModule, ConfigService } from '@nestjs/config';
// import { databaseConfig } from './config/database.config';
// import { UsersModule } from './modules/users/users.module';
// // import { AuthModule } from './modules/auth/auth.module';
// import { AuthModule } from './modules/auth/auth.module';

// @Module({
//   imports: [
//     ConfigModule.forRoot({
//       isGlobal: true,
//       envFilePath: '.env',
//     }),
//     TypeOrmModule.forRootAsync({
//       imports: [ConfigModule],
//       useFactory: databaseConfig,
//       inject: [ConfigService],
//     }),
//     UsersModule,
//     AuthModule,
//     // AuthModule,
//   ],
// })
// export class AppModule {}
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { databaseConfig } from './config/database.config';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { PropertiesModule } from './modules/properties/properties.module';
import { BookingsModule } from './modules/bookings/bookings.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { ProductsModule } from './modules/products/products.module';
import { OrdersModule } from './modules/orders/orders.module';
import { CategoriesModule } from './modules/categories/categories.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: databaseConfig,
      inject: [ConfigService],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: true,
      introspection: true,
      path: '/graphql',
      csrfPrevention: false, // Disable CSRF for mobile app compatibility
      context: ({ req, res }) => {
        // Extract JWT token from various formats
        let token = null;
        const authHeader = req.headers?.authorization;
        
        if (authHeader) {
          if (authHeader.startsWith('Bearer ')) {
            token = authHeader.substring(7);
          } else if (authHeader.startsWith('JWT ')) {
            token = authHeader.substring(4);
          }
        }
        
        // Also check cookies
        if (!token) {
          token = req.cookies?.JWT || req.cookies?.token;
        }
        
        return {
          req: {
            ...req,
            headers: {
              ...req.headers,
              authorization: token ? `Bearer ${token}` : req.headers.authorization,
            },
          },
          res,
        };
      },
      formatError: (error) => {
        return {
          message: error.message,
          code: error.extensions?.code,
          path: error.path,
        };
      },
    }),
    UsersModule,
    AuthModule,
    PropertiesModule,
    BookingsModule,
    ReviewsModule,
    PaymentsModule,
    ProductsModule,
    OrdersModule,
    CategoriesModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}