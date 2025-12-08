import { DataSource } from 'typeorm';
import { databaseConfig } from '../../config/database.config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { seedDatabase } from './seed';
import { User } from '../../modules/users/entities/user.entity';
import { Property } from '../../modules/properties/entities/property.entity';
import { RoomUnit } from '../../modules/properties/entities/room-unit.entity';
import { Booking } from '../../modules/bookings/entities/booking.entity';
import { Payment } from '../../modules/bookings/entities/payment.entity';
import { Review } from '../../modules/reviews/entities/review.entity';

async function runSeed() {
  const configModule = ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: '.env',
  });

  const configService = new ConfigService();
  const dbConfig = databaseConfig(configService) as any;

  const dataSource = new DataSource({
    type: dbConfig.type,
    host: dbConfig.host,
    port: dbConfig.port,
    username: dbConfig.username,
    password: dbConfig.password,
    database: dbConfig.database,
    entities: [User, Property, RoomUnit, Booking, Payment, Review],
    synchronize: dbConfig.synchronize,
    logging: dbConfig.logging,
  });

  try {
    await dataSource.initialize();
    console.log('📦 Database connected, starting seed...\n');
    await seedDatabase(dataSource);
    await dataSource.destroy();
    console.log('\n✅ Seed completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    await dataSource.destroy();
    process.exit(1);
  }
}

runSeed();

