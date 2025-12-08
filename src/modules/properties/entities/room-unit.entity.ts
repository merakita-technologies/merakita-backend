import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../shared/entities/base.entity';
import { Property } from './property.entity';
import { Booking } from '../../bookings/entities/booking.entity';

@Entity('room_units')
export class RoomUnit extends BaseEntity {
  @Column()
  roomNumber: string;

  @Column()
  roomType: string; // single, double, suite, etc.

  @Column()
  capacity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  basePricePerNight: number;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column('simple-array', { nullable: true })
  images?: string[];

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => Property, (property) => property.rooms)
  @JoinColumn({ name: 'propertyId' })
  property: Property;

  @Column()
  propertyId: string;

  @OneToMany(() => Booking, (booking) => booking.roomUnit)
  bookings: Booking[];
}

