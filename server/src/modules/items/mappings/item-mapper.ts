import { RetrieveItemDto } from '../dto/retrieve-item.dto';
import { Item } from '../schemas/item.schema';

/**
 * Utility class responsible for mapping database `Item` documents to `RetrieveItemDto`.
 */
export class ItemMapper {
  /**
   * Maps an `Item` database document to a `RetrieveItemDto` object.
   *
   * @param {Item} document - The item document retrieved from the database.
   * @param {string} locale - The locale used to retrieve the item's title and description.
   * @returns {RetrieveItemDto} A DTO containing the mapped item data.
   */
  static toDto(document: Item, locale: string): RetrieveItemDto {
    return {
      id: document.definition.item.id,
      level: document.definition.item.level,
      baseParameters: {
        itemTypeId: document.definition.item.baseParameters?.itemTypeId,
        itemSetId: document.definition.item.baseParameters.itemSetId,
      },
      graphicParameters: {
        gfxId: document.definition.item.graphicParameters.gfxId,
        femaleGfxId: document.definition.item.graphicParameters.femaleGfxId,
      },
      title: document.title?.[locale],
      description: document.description?.[locale],
    };
  }
}
