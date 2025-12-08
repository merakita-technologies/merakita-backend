import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './entities/booking.entity';
import { Payment } from './entities/payment.entity';
import { RoomUnit } from '../properties/entities/room-unit.entity';
import { Property } from '../properties/entities/property.entity';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingsRepository: Repository<Booking>,
    @InjectRepository(Payment)
    private paymentsRepository: Repository<Payment>,
    @InjectRepository(RoomUnit)
    private roomUnitsRepository: Repository<RoomUnit>,
    @InjectRepository(Property)
    private propertiesRepository: Repository<Property>,
  ) {}

  async create(createBookingDto: any, userId: string): Promise<Booking> {
    const roomUnit = await this.roomUnitsRepository.findOne({
      where: { id: createBookingDto.roomUnitId },
      relations: ['property'],
    });

    if (!roomUnit) {
      throw new NotFoundException('Room unit not found');
    }

    const checkIn = new Date(createBookingDto.checkInDate);
    const checkOut = new Date(createBookingDto.checkOutDate);

    if (checkOut <= checkIn) {
      throw new BadRequestException('Check-out date must be after check-in date');
    }

    const durationNights = Math.ceil(
      (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24),
    );

    const totalPrice = Number(roomUnit.basePricePerNight) * durationNights;

    const booking = this.bookingsRepository.create({
      ...createBookingDto,
      userId,
      propertyId: roomUnit.propertyId,
      durationNights,
      totalPrice,
      status: 'pending',
    });

    const savedBooking = (await this.bookingsRepository.save(booking)) as unknown as Booking;

    // Create payment
    const payment = this.paymentsRepository.create({
      bookingId: savedBooking.id,
      amount: totalPrice,
      status: 'pending',
    });

    await this.paymentsRepository.save(payment);

    const result = await this.bookingsRepository.findOne({
      where: { id: savedBooking.id },
      relations: ['user', 'roomUnit', 'property', 'payment'],
    });

    if (!result) {
      throw new NotFoundException('Booking not found after creation');
    }

    return result;
  }

  async findByUser(userId: string, status?: string): Promise<Booking[]> {
    const query = this.bookingsRepository
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.user', 'user')
      .leftJoinAndSelect('booking.roomUnit', 'roomUnit')
      .leftJoinAndSelect('booking.property', 'property')
      .leftJoinAndSelect('booking.payment', 'payment')
      .where('booking.userId = :userId', { userId })
      .andWhere('booking.isActive = :isActive', { isActive: true });

    if (status) {
      query.andWhere('booking.status = :status', { status });
    }

    return await query.getMany();
  }
}

