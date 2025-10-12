import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, Max, Min } from 'class-validator';

export class PaginationDto {
  @Transform(({ value }) => +value)
  @ApiProperty({
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  skip?: number;

  @Transform(({ value }) => +value)
  @ApiProperty({
    required: false,
  })
  @IsNumber()
  @Max(50)
  @IsOptional()
  take?: number;
}

export class PaginatedResponseDto<T> {
  @ApiProperty()
  totalCount: number;

  @ApiProperty()
  skip: number;

  @ApiProperty()
  limit: number;

  data: T[];
}
