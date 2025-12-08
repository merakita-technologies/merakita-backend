import { ObjectType, Field, InputType, Int } from '@nestjs/graphql';

@ObjectType()
export class ReviewUserType {
  @Field()
  id: string;

  @Field()
  email: string;

  @Field()
  fullName: string;
}

@ObjectType()
export class ReviewPropertyType {
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
export class ReviewType {
  @Field()
  id: string;

  @Field(() => Int)
  rating: number;

  @Field()
  title: string;

  @Field()
  comment: string;

  @Field()
  reviewDate: Date;

  @Field()
  isVerified: boolean;

  @Field(() => Int)
  helpfulVotes: number;

  @Field()
  isPublic: boolean;

  @Field(() => ReviewUserType, { nullable: true })
  user?: ReviewUserType;

  @Field(() => ReviewPropertyType, { nullable: true })
  property?: ReviewPropertyType;
}

@InputType()
export class ReviewInput {
  @Field()
  bookingId: string;

  @Field()
  propertyId: string;

  @Field(() => Int)
  rating: number;

  @Field()
  title: string;

  @Field()
  comment: string;

  @Field({ nullable: true })
  isPublic?: boolean;
}

@ObjectType()
export class CreateReviewResponse {
  @Field()
  success: boolean;

  @Field()
  message: string;

  @Field(() => ReviewType, { nullable: true })
  review?: ReviewType;
}

