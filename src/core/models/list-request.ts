import { ApiProperty, IntersectionType, PartialType } from '@nestjs/swagger';

export class PagedRequest {
  @ApiProperty({ default: 0 })
  offset: number;
  @ApiProperty({ default: 10 })
  limit: number;
}

export class SortedRequest {
  @ApiProperty()
  sort: [string, string][];
}

export class PagedAndSortedRequest extends PartialType(
  IntersectionType(PagedRequest, SortedRequest),
) {}
