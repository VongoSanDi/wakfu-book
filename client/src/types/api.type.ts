/**
 * Metadatas send by the server
 */
export interface PageMeta {
  page: number;
  take: number;
  itemCount: number;
  totalCount: number;
  pageCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

/**
 * Response type send by the server
 */
export interface ApiResponse<T> {
  data: T,
  meta?: {
    pagination: PageMeta,
    timestamp: string
  }
}

export const orderValues = ['ASC', 'DESC'] as const;
export type Order = typeof orderValues[number]; // "ASC" | "DESC"

/**
 * Pagination params
 */
export interface PaginationParams {
  take?: number;
  page?: number;
  order?: Order;
  orderBy?: string;
}
