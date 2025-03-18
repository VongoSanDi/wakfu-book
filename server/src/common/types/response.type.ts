import { PageMetaDto, PageOptionsDto } from '../dto/page-options.dto';

// Used for sending back a single object
export interface Response<T> {
  data: T | null;
  meta?: PageMetaDto;
  timestamp: string;
}

// Used for sending back multiples objects
export interface PaginatedResponse<T> {
  results: T[];
  itemCount: number;
  totalCount: number;
  pageOptionsDto: PageOptionsDto;
}
