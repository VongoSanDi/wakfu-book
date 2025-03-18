import { Item } from "@/types/item.type";
import { ApiService } from "./apiService";

export class ItemService extends ApiService<Item> {
  protected baseUrl = `${import.meta.env.VITE_API_URL}`;
  protected endpoint = '/items';

  async find(dto: RetrieveItemDto): Promise<Item[]> {
    return this.fetchApi<Item[]>(`${this.url}/search?name=${encodeURIComponent(title)}`);
  }
}
