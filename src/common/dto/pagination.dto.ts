import { IsOptional, IsPositive, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class PaginationDto {
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

  // This allows other properties to pass through validation
  [key: string]: any;
}