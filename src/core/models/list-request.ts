import { ApiProperty, IntersectionType, PartialType } from '@nestjs/swagger';

export class PaginatedRequest {
  @ApiProperty()
  offset: number;
  @ApiProperty()
  limit: number;
}

export class SortedRequest {
  @ApiProperty()
  sort: [string, string][];
}

export class ListRequest extends PartialType(
  IntersectionType(PaginatedRequest, SortedRequest),
) {}
