import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class ListResponseDto<T> {
  @ApiProperty()
  total: number;
  @ApiProperty()
  @IsNumber()
  pageSize: number;
  @ApiProperty()
  @IsNumber()
  page: number;
  @IsNumber()
  totalPages: number;
  @ApiProperty({ type: Object })
  data: T[];
}
