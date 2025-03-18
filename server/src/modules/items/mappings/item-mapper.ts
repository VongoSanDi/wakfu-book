import { RetrieveItemDto } from '../dto/retrieve-item.dto';
import { Item } from '../schemas/item.schema';

export class ItemMapper {
  static toDto(document: Item, locale: string): RetrieveItemDto {
    return {
      id: document.definition.item.id,
      baseParameters: {
        itemTypeId: document.definition.item.baseParameters?.itemTypeId,
        itemSetId: document.definition.item.baseParameters.itemSetId,
      },
      title: document.title?.[locale],
      description: document.description?.[locale],
    };
  }
}
