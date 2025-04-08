import type { PaginatedItem } from "@/types/item.type";
import { ApiService } from "../apiService";
import type { RetrieveItemDto } from "./dto/retrieve-item.dto";
import type { PageMeta } from "@/types/api.type";

export class ItemService extends ApiService<PaginatedItem> {
  protected baseUrl = import.meta.env.VITE_SERVER_URL;
  protected endpoint = '/items';
  protected baseUrlCdn = "https://cdn.jsdelivr.net/gh/VongoSanDi/wakfu-assets@main/items"

  /**
  * Retrive paginated list of items
  *
  * @param {string} locale Locale selected
  * @param {RetrieveItemDto} dto Filter
  * @returns {Promise<{ Item[]}>}
  *
  */
  async find(locale: string, dto: RetrieveItemDto): Promise<PaginatedItem> {
    const queryParams = new URLSearchParams({
      ...(dto.itemTypeId !== undefined && { itemTypeId: dto.itemTypeId.toString() }),
      ...(dto.title && { title: dto.title }),
      ...(dto.levelMin && { levelMin: dto.levelMin.toString() }),
      ...(dto.levelMax && { levelMax: dto.levelMax.toString() }),
      order: dto.order ?? "ASC",
      orderBy: dto.orderBy ?? "definition.item.id",
      ...(dto.page !== undefined && { page: dto.page.toString() }),
      ...(dto.take !== undefined && { take: dto.take.toString() }),
    });

    const url = `${this.baseUrl}${this.endpoint}/${locale}?${queryParams.toString()}`;

    const results = await this.fetchApi<{ data: PaginatedItem[], meta: PageMeta }>(url);

    const itemsWithImages = results.data.map((item: any) => ({
      ...item,
      imageUrl: `${this.baseUrlCdn}/${item.graphicParameters.gfxId}.webp`,
    }))

    return { ...results, data: itemsWithImages };
  }
}

// Singleton
export const itemService = new ItemService();
