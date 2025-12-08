import { ObjectType, Field, Float } from '@nestjs/graphql';

@ObjectType()
export class PaymentType {
  @Field()
  id: string;

  @Field(() => Float)
  amount: number;

  @Field()
  status: string;

  @Field({ nullable: true })
  paymentMethod?: string;
}

@ObjectType()
export class ConfirmPaymentResponse {
  @Field()
  success: boolean;

  @Field()
  message: string;

  @Field(() => PaymentType, { nullable: true })
  payment?: PaymentType;
}

