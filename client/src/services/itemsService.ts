import type { Item } from "@/types/item.type";
import type { RetrieveItemDto } from "./items/dto/retrieve-item.dto";
import { ApiService } from "./apiService";
import type { PageMeta } from "@/types/api.type";

export class ItemService extends ApiService<Item> {
  protected baseUrl = import.meta.env.VITE_SERVER_URL;
  protected endpoint = '/items';

  async find(dto: RetrieveItemDto): Promise<Item[]> {

    const queryParams = new URLSearchParams({
      locale: dto.locale,
      order: dto.order ?? "ASC",
      orderBy: dto.orderBy ?? "definition.item.id",
      ...(dto.itemTypeId && { itemTypeId: dto.itemTypeId.toString() }),
      ...(dto.title && { title: dto.title }),
      ...(dto.page && { page: dto.page.toString() }),
      ...(dto.take && { take: dto.take.toString() }),
    });

    const results = await this.fetchApi<{ data: Item[], meta: PageMeta }>(`${this.baseUrl}${this.endpoint}?${queryParams.toString()}`);

    return results.data;
  }
}

// Singleton
export const itemService = new ItemService();
