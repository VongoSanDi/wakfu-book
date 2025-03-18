import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PageOptionsDto {
  @ApiPropertyOptional()
  readonly take: number;

  @ApiPropertyOptional()
  readonly page: number;

  @ApiPropertyOptional()
  readonly order: string;

  @ApiPropertyOptional()
  readonly orderBy: string;

  @ApiPropertyOptional()
  readonly skip: number;

  constructor(partial: Partial<PageOptionsDto>) {
    this.page = partial.page ?? 1;
    this.take = partial.take ?? 10;
    this.order = partial.order ?? 'ASC';
    this.orderBy = partial.orderBy ?? 'definition.id';

    this.skip = (this.page - 1) * this.take;
  }
}

/**
 *  page = Current page
 *  take = element count per page
 *  itemCount = total number of element returned by the DB
 *  totalCount = total number of element corresponding to filter
 *  pageCount = total page number
 *  hasPreviousPage & hasNextPage = tell us if there is other page or not
 */
export class PageMetaDto {
  constructor(
    pageOptionsDto: PageOptionsDto,
    itemCount: number,
    totalCount: number,
  ) {
    this.page = pageOptionsDto.page;
    this.take = pageOptionsDto.take;
    this.itemCount = itemCount;
    this.totalCount = totalCount;
    this.pageCount = Math.ceil(totalCount / pageOptionsDto.take);
    this.hasPreviousPage = this.page > 1;
    this.hasNextPage = this.page < this.pageCount;
  }
  @ApiProperty()
  readonly page: number;

  @ApiProperty()
  readonly take: number;

  @ApiProperty()
  readonly itemCount: number;

  @ApiProperty()
  readonly totalCount: number;

  @ApiProperty()
  readonly pageCount: number;

  @ApiProperty()
  readonly hasPreviousPage: boolean;

  @ApiProperty()
  readonly hasNextPage: boolean;
}
