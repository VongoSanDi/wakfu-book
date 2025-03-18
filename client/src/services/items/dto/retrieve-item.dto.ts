import type { PaginationParams } from "@/types/api.type";

export interface RetrieveItemDto extends PaginationParams {
  itemTypeId?: number;
  locale: string;
  title?: string;
}
