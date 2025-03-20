/**
 * Interface representing the structure of an API error response.
 */
export interface ApiError {
  /**
   * HTTP status code of the error response.
   * Example: `400`, `404`, `500`
   */
  statusCode: number;

  /**
   * Error message describing the issue.
   * Can be a single string or an array of messages in case of multiple errors.
   * Example: `"Invalid request parameter"` or `["Field 'name' is required", "Field 'age' must be a number"]`
   */
  message: string | string[];

  /**
   * General error type or category.
   * Typically a short description of the error type.
   * Example: `"Bad Request"`, `"Unauthorized"`, `"Internal Server Error"`
   */
  errors: string;

  /**
   * Timestamp indicating when the error occurred, in ISO 8601 format.
   * Example: `"2024-03-20T14:00:00.000Z"`
   */
  timestamp: string;

  /**
   * Path of the API endpoint that triggered the error.
   * Example: `"/api/items/42"`
   */
  path: string;

  /**
   * Additional parameters related to the error (optional).
   * Can include request parameters that caused the error.
   * Example:
   * ```json
   * { "field": "email", "reason": "Invalid format" }
   * ```
   */
  parameters?: { [key: string]: any };

  /**
   * Stack trace location indicating where the error originated (optional).
   * Useful for debugging.
   * Example: `"at ItemsService.find (items.service.ts:42:13)"`
   */
  stackLocation?: string;
}
