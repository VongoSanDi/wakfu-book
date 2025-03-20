import { RetrieveActionDto } from '../dto/retrieve-action.dto';
import { Action } from '../schemas/actions.schema';

/**
 * Utility class responsible for mapping database `Action` documents to `RetrieveActionDto`.
 */
export class ActionMapper {
  /**
   * Maps an `Action` database document to a `RetrieveActionDto` object.
   *
   * @param {Action} document - The action document retrieved from the database.
   * @param {string} locale - The locale used to retrieve the action's description.
   * @returns {RetrieveActionDto} A DTO containing the mapped item data.
   */
  static toDto(document: Action, locale: string): RetrieveActionDto {
    return {
      id: document.definition.id,
      effect: document.definition.effect,
      description: document.description?.[locale],
    };
  }
}
