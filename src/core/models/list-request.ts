import { ApiProperty, IntersectionType, PartialType } from '@nestjs/swagger';

export class PagedRequest {
  @ApiProperty()
  offset: number;
  @ApiProperty()
  limit: number;
}

export class SortedRequest {
  @ApiProperty()
  sort: [string, string][];
}

export class PagedAndSortedRequest extends PartialType(
  IntersectionType(PagedRequest, SortedRequest),
) {}
