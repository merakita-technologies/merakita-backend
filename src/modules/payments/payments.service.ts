import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from '../bookings/entities/payment.entity';
import { Booking } from '../bookings/entities/booking.entity';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentsRepository: Repository<Payment>,
    @InjectRepository(Booking)
    private bookingsRepository: Repository<Booking>,
  ) {}

  async confirmPayment(paymentId: string, paymentMethod: string, userId: string): Promise<Payment> {
    const payment = await this.paymentsRepository.findOne({
      where: { id: paymentId },
      relations: ['booking'],
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    // Verify booking belongs to user
    if (payment.booking.userId !== userId) {
      throw new BadRequestException('Payment does not belong to this user');
    }

    if (payment.status === 'paid') {
      throw new BadRequestException('Payment already confirmed');
    }

    // Update payment status
    payment.status = 'paid';
    payment.paymentMethod = paymentMethod;

    const savedPayment = (await this.paymentsRepository.save(payment)) as unknown as Payment;

    // Update booking status to confirmed
    await this.bookingsRepository.update(
      { id: payment.bookingId },
      { status: 'confirmed' },
    );

    const result = await this.paymentsRepository.findOne({
      where: { id: paymentId },
      relations: ['booking'],
    });

    if (!result) {
      throw new NotFoundException('Payment not found after update');
    }

    return result;
  }

  async getPaymentByBookingId(bookingId: string, userId: string): Promise<Payment> {
    const booking = await this.bookingsRepository.findOne({
      where: { id: bookingId },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.userId !== userId) {
      throw new BadRequestException('Booking does not belong to this user');
    }

    const payment = await this.paymentsRepository.findOne({
      where: { bookingId },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found for this booking');
    }

    return payment;
  }
}

