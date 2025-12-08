import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../shared/entities/base.entity';
import { User } from '../../users/entities/user.entity';
import { Property } from '../../properties/entities/property.entity';
import { Booking } from '../../bookings/entities/booking.entity';

@Entity('reviews')
export class Review extends BaseEntity {
  @Column()
  rating: number; // 1-5

  @Column()
  title: string;

  @Column({ type: 'text' })
  comment: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  reviewDate: Date;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ default: 0 })
  helpfulVotes: number;

  @Column({ default: true })
  isPublic: boolean;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @ManyToOne(() => Property, (property) => property.reviews)
  @JoinColumn({ name: 'propertyId' })
  property: Property;

  @Column()
  propertyId: string;

  @ManyToOne(() => Booking, { nullable: true })
  @JoinColumn({ name: 'bookingId' })
  booking?: Booking;

  @Column({ nullable: true })
  bookingId?: string;
}

