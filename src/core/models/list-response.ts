import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class ListResponseDto<T> {
  @ApiProperty()
  total: number;
  @ApiProperty()
  @IsNumber()
  limit: number;
  @ApiProperty()
  @IsNumber()
  offset: number;
  @ApiProperty({ type: Object })
  data: T[];
}
