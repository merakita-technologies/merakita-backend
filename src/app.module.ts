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
import { databaseConfig } from './config/database.config';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
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
    UsersModule,
    AuthModule,
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