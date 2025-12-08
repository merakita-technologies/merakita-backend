import { Entity, Column, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../shared/entities/base.entity';
import { User } from '../../users/entities/user.entity';
import { RoomUnit } from '../../properties/entities/room-unit.entity';
import { Property } from '../../properties/entities/property.entity';
import { Payment } from './payment.entity';

@Entity('bookings')
export class Booking extends BaseEntity {
  @Column({ type: 'date' })
  checkInDate: Date;

  @Column({ type: 'date' })
  checkOutDate: Date;

  @Column('simple-array', { nullable: true })
  guestNames?: string[];

  @Column({ type: 'text', nullable: true })
  specialRequests?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalPrice: number;

  @Column({ default: 'pending' })
  status: string; // pending, confirmed, cancelled, completed

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  bookingDate: Date;

  @Column()
  durationNights: number;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @ManyToOne(() => RoomUnit, (room) => room.bookings)
  @JoinColumn({ name: 'roomUnitId' })
  roomUnit: RoomUnit;

  @Column()
  roomUnitId: string;

  @ManyToOne(() => Property)
  @JoinColumn({ name: 'propertyId' })
  property: Property;

  @Column()
  propertyId: string;

  @OneToOne(() => Payment, (payment) => payment.booking, { nullable: true })
  payment?: Payment;
}

