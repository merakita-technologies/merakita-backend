import { ObjectType, Field, InputType, Float, Int } from '@nestjs/graphql';

@ObjectType()
export class UserOwnerType {
  @Field()
  id: string;

  @Field()
  email: string;

  @Field()
  fullName: string;
}

@ObjectType()
export class RoomUnitType {
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

  @Field({ nullable: true })
  description?: string;

  @Field(() => [String], { nullable: true })
  images?: string[];

  @Field()
  isActive: boolean;
}

@ObjectType()
export class PropertyType {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  address: string;

  @Field()
  city: string;

  @Field()
  country: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  propertyType: string;

  @Field(() => Float)
  rating: number;

  @Field(() => [String], { nullable: true })
  imageUrls?: string[];

  @Field(() => Float, { nullable: true })
  latitude?: number;

  @Field(() => Float, { nullable: true })
  longitude?: number;

  @Field({ nullable: true })
  checkInTime?: string;

  @Field({ nullable: true })
  checkOutTime?: string;

  @Field({ nullable: true })
  cancellationPolicy?: string;

  @Field()
  dynamicPricingEnabled: boolean;

  @Field()
  isActive: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => UserOwnerType, { nullable: true })
  owner?: UserOwnerType;

  @Field(() => [RoomUnitType], { nullable: true })
  rooms?: RoomUnitType[];
}

