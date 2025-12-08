import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../shared/entities/base.entity';
import { User } from '../../users/entities/user.entity';
import { RoomUnit } from './room-unit.entity';
import { Review } from '../../reviews/entities/review.entity';

@Entity('properties')
export class Property extends BaseEntity {
  @Column()
  name: string;

  @Column()
  address: string;

  @Column()
  city: string;

  @Column()
  country: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column()
  propertyType: string; // hotel, apartment, villa, etc.

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  rating: number;

  @Column('simple-array', { nullable: true })
  imageUrls?: string[];

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  latitude?: number;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  longitude?: number;

  @Column({ type: 'time', nullable: true })
  checkInTime?: string;

  @Column({ type: 'time', nullable: true })
  checkOutTime?: string;

  @Column({ type: 'text', nullable: true })
  cancellationPolicy?: string;

  @Column({ default: false })
  dynamicPricingEnabled: boolean;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'ownerId' })
  owner: User;

  @Column()
  ownerId: string;

  @OneToMany(() => RoomUnit, (room) => room.property)
  rooms: RoomUnit[];

  @OneToMany(() => Review, (review) => review.property)
  reviews: Review[];
}

