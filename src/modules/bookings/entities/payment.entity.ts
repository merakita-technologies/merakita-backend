import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../shared/entities/base.entity';
import { Booking } from './booking.entity';

@Entity('payments')
export class Payment extends BaseEntity {
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ default: 'pending' })
  status: string; // pending, paid, failed, refunded

  @Column({ nullable: true })
  paymentMethod?: string; // credit_card, bank_transfer, etc.

  @OneToOne(() => Booking, (booking) => booking.payment)
  @JoinColumn({ name: 'bookingId' })
  booking: Booking;

  @Column()
  bookingId: string;
}

