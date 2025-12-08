import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingsService } from './bookings.service';
import { BookingsResolver } from './bookings.resolver';
import { Booking } from './entities/booking.entity';
import { Payment } from './entities/payment.entity';
import { PropertiesModule } from '../properties/properties.module';
import { RoomUnit } from '../properties/entities/room-unit.entity';
import { Property } from '../properties/entities/property.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking, Payment, RoomUnit, Property]),
    PropertiesModule,
  ],
  providers: [BookingsService, BookingsResolver],
  exports: [BookingsService],
})
export class BookingsModule {}

