import { ApiProperty } from '@nestjs/swagger';

export class ListResponseDto<T> {
  @ApiProperty()
  total: number;
  @ApiProperty()
  limit: number;
  @ApiProperty()
  offset: number;
  @ApiProperty({ type: Object })
  data: T[];
}
