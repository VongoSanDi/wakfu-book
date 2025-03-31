import { RetrieveResourceDto } from "../dto/retrieve-resource.dto";
import { Resource } from "../schemas/resource.schema";

/**
 * Utility class responsible for mapping database `Action` documents to `RetrieveActionDto`.
 */
export class ResourceMapper {
  /**
   * Maps an `Resource` database document to a `RetrieveResourceDto` object.
   *
   * @param {Resource} document - The resource document retrieved from the database.
   * @param {string} locale - The locale used to retrieve the resource's title.
   * @returns {RetrieveResourceDto} A DTO containing the mapped item data.
   */
  static toDto(document: Resource, locale: string): RetrieveResourceDto {
    return {
      definition: document.definition,
      title: document.title?.[locale],
    };
  }
}
