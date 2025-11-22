import { IsString, IsOptional, IsNumber, Min, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class SearchUsersDto {
  @ApiProperty({
    description: 'Search query for first name, last name, or email',
    required: true,
  })
  @IsString()
  search: string; // Changed from 'q' to 'search'

  @ApiProperty({
    required: false,
    default: 1,
    description: 'Page number',
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  @Min(1)
  page: number = 1;

  @ApiProperty({
    required: false,
    default: 10,
    description: 'Number of items per page',
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  @Min(1)
  limit: number = 10;

  get skip(): number {
    return (this.page - 1) * this.limit;
  }

  get take(): number {
    return this.limit;
  }
}