import { ObjectType, Field, InputType, Float, Int } from '@nestjs/graphql';
import { PaymentType } from '../../payments/dto/graphql.dto';

@ObjectType()
export class BookingUserType {
  @Field()
  id: string;

  @Field()
  email: string;

  @Field()
  fullName: string;
}

@ObjectType()
export class BookingRoomUnitType {
  @Field()
  id: string;

  @Field()
  roomNumber: string;

  @Field()
  roomType: string;

  @Field(() => Int)
  capacity: number;

  @Field(() => Float)
  basePricePerNight: number;
}

@ObjectType()
export class BookingPropertyType {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  city: string;

  @Field()
  country: string;
}

@ObjectType()
export class BookingType {
  @Field()
  id: string;

  @Field()
  checkInDate: string;

  @Field()
  checkOutDate: string;

  @Field(() => [String], { nullable: true })
  guestNames?: string[];

  @Field({ nullable: true })
  specialRequests?: string;

  @Field(() => Float)
  totalPrice: number;

  @Field()
  status: string;

  @Field()
  bookingDate: Date;

  @Field(() => Int)
  durationNights: number;

  @Field()
  isActive: boolean;

  @Field(() => BookingUserType, { nullable: true })
  user?: BookingUserType;

  @Field(() => BookingRoomUnitType, { nullable: true })
  roomUnit?: BookingRoomUnitType;

  @Field(() => BookingPropertyType, { nullable: true })
  property?: BookingPropertyType;

  @Field(() => PaymentType, { nullable: true })
  payment?: PaymentType;
}

@ObjectType()
export class CreateBookingResponse {
  @Field()
  success: boolean;

  @Field()
  message: string;

  @Field(() => BookingType, { nullable: true })
  booking?: BookingType;
}

@InputType()
export class BookingInput {
  @Field()
  roomUnitId: string;

  @Field()
  checkInDate: string;

  @Field()
  checkOutDate: string;

  @Field(() => [String], { nullable: true })
  guestNames?: string[];

  @Field({ nullable: true })
  specialRequests?: string;

  @Field(() => [String], { nullable: true })
  addOnIds?: string[];
}

