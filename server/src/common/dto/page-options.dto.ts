import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO for pagination options.
 *
 * This DTO defines the properties used for pagination, sorting, and data retrieval in API queries.
 */
export class PageOptionsDto {
  /**
   * Number of items to retrieve per page.
   * Defaults to `10` if not provided.
   *
   * @example 20
   */
  @ApiPropertyOptional()
  readonly take: number;

  /**
   * Current page number.
   * Defaults to `1` if not provided.
   *
   * @example 2
   */
  @ApiPropertyOptional()
  readonly page: number;

  /**
   * Sorting order: `'ASC'` for ascending, `'DESC'` for descending.
   * Defaults to `'ASC'` if not provided.
   *
   * @example "DESC"
   */
  @ApiPropertyOptional()
  readonly order: string;

  /**
   * Field by which to order the items.
   * Defaults to `'definition.id'` if not provided.
   *
   * @example "definition.item.id"
   */
  @ApiPropertyOptional()
  readonly orderBy: string;

  /**
   * Number of items to skip (computed from `page` and `take`).
   * Only used by mongoose
   *
   * @example 10
   */
  @ApiPropertyOptional()
  readonly skip: number;

  /**
   * Constructs a `PageOptionsDto` instance, applying default values if necessary.
   *
   * @param {Partial<PageOptionsDto>} partial - Partial pagination options.
   */
  constructor(partial: Partial<PageOptionsDto>) {
    this.page = partial.page ?? 1;
    this.take = partial.take !== undefined ? partial.take : 10;
    this.order = partial.order ?? 'ASC';
    this.orderBy = partial.orderBy ?? 'definition.id';

    this.skip = (this.page - 1) * this.take;
  }
}

/**
 * DTO representing pagination metadata
 *
 * This DTO provides additional information about paginated results, including total counts, page numbers, and navigation flags.
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

  /**
   * Current page number.
   *
   * @example 1
   */
  @ApiProperty()
  readonly page: number;

  /**
   * Number of items per page.
   *
   * @example 10
   */
  @ApiProperty()
  readonly take: number;

  /**
   * Number of items returned in the current page.
   *
   * @example 5
   */
  @ApiProperty()
  readonly itemCount: number;

  /**
   * Total number of matching items in the database.
   *
   * @example 100
   */
  @ApiProperty()
  readonly totalCount: number;

  /**
   * Total number of pages.
   *
   * @example 10
   */
  @ApiProperty()
  readonly pageCount: number;

  /**
   * Indicates if there is a previous page.
   *
   * @example false
   */
  @ApiProperty()
  readonly hasPreviousPage: boolean;

  /**
   * Indicates if there is a next page.
   *
   * @example true
   */
  @ApiProperty()
  readonly hasNextPage: boolean;
}
