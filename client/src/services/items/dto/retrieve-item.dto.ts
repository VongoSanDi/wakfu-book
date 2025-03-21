import type { PaginationParams } from "@/types/api.type";

export interface RetrieveItemDto extends PaginationParams {
  itemTypeId?: number;
  title?: string;
  levelMin?: number;
  levelMax?: number;
}
