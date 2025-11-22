// import { IsEmail, IsString, MinLength, IsNotEmpty } from 'class-validator';

// export class CreateUserDto {
//   @IsEmail()
//   @IsNotEmpty()
//   email: string;

//   @IsString()
//   @MinLength(6)
//   @IsNotEmpty()
//   password: string;

//   @IsString()
//   @IsNotEmpty()
//   firstName: string;

//   @IsString()
//   @IsNotEmpty()
//   lastName: string;
// }

// export class UpdateUserDto {
//   @IsString()
//   firstName?: string;

//   @IsString()
//   lastName?: string;
// }

import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'password123', minLength: 6 })
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: 'John' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  @IsNotEmpty()
  lastName: string;
}

export class UpdateUserDto {
  @IsString()
  firstName?: string;

  @IsString()
  lastName?: string;
}