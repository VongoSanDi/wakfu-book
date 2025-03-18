import type { Item } from "@/types/item.type";
import type { RetrieveItemDto } from "./items/dto/retrieve-item.dto";
import { ApiService } from "./apiService";

export class ItemService extends ApiService<Item> {
  protected baseUrl = `${import.meta.env.SERVER_URL}`;
  protected endpoint = '/items';

  async find(dto: RetrieveItemDto): Promise<Item[]> {
    const queryParams = {
      itemTypeId: dto.itemTypeId,
      locale: dto.locale,
      title: dto.locale,
      page: dto.page?.toString(),
      take: dto.take?.toString(),
      order: dto.order || "ASC",
      orderBy: dto.orderBy || "definition.item.id",
    }
    return this.fetchApi<Item[]>(`${this.baseUrl}${this.endpoint}?${queryParams.toString()}`);
  }
}
