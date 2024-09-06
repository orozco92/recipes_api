import { ApiProperty, IntersectionType, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class PagedRequest {
  @ApiProperty({ default: 1 })
  @Transform(({ value }) => {
    const parsed = Number.parseInt(value);
    if (Number.isNaN(parsed) || parsed < 1) return 1;
    return parsed;
  })
  page: number;
  @ApiProperty({ default: 10 })
  @Transform(({ value }) => {
    const parsed = Number.parseInt(value);
    if (Number.isNaN(parsed) || parsed < 1) return 1;
    return parsed;
  })
  pageSize: number;
}

export class SortedRequest {
  @ApiProperty()
  sort: [string, string][];
}

export class PagedAndSortedRequest extends PartialType(
  IntersectionType(PagedRequest, SortedRequest),
) {}
