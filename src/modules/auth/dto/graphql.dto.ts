import { InputType, Field, ObjectType } from '@nestjs/graphql';

@InputType()
export class LoginInput {
  @Field()
  email: string;

  @Field()
  password: string;
}

@InputType()
export class RegisterInput {
  @Field()
  email: string;

  @Field()
  password: string;

  @Field({ nullable: true })
  fullName?: string;

  @Field({ nullable: true })
  phoneNumber?: string;
}

@ObjectType()
export class UserType {
  @Field()
  id: string;

  @Field()
  email: string;

  @Field()
  fullName: string;

  @Field({ nullable: true })
  phoneNumber?: string;

  @Field({ nullable: true })
  loyaltyPoints?: number;
}

@ObjectType()
export class LoginResponse {
  @Field()
  success: boolean;

  @Field()
  message: string;

  @Field({ nullable: true })
  token?: string;

  @Field(() => UserType, { nullable: true })
  user?: UserType;
}

@ObjectType()
export class CreateUserResponse {
  @Field()
  success: boolean;

  @Field()
  message: string;

  @Field(() => UserType, { nullable: true })
  user?: UserType;
}

