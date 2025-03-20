import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PageMetaDto } from '../dto/page-options.dto';
import { Response, PaginatedResponse } from '../types/response.type';

/**
 * Interceptor that transforms API responses to a standardized format.
 *
 * - If the response is paginated, it structures the response with pagination metadata.
 * - Otherwise, it wraps the data with a timestamp.
 *
 * @template T - The type of the data being returned.
 */
@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T | PaginatedResponse<T>, Response<T | T[]>>
{
  /**
   * Intercepts and transforms the API response.
   *
   * @param {ExecutionContext} context - The current execution context of the request.
   * @param {CallHandler} next - The handler that processes the request.
   * @returns {Observable<Response<T | T[]>>} An observable that emits the transformed response.
   */
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T | T[]>> {
    return next.handle().pipe(
      map((data) => {
        const timestamp = new Date().toISOString();

        if (this.isPaginatedResponse(data)) {
          return {
            data: data.data,
            meta: new PageMetaDto(
              data.pageOptionsDto,
              data.itemCount,
              data.totalCount,
            ),
            timestamp,
          };
        }

        return {
          data,
          timestamp,
        };
      }),
    );
  }

  /**
   * Determines if the given data follows the `PaginatedResponse<T>` structure.
   *
   * @param {any} data - The data to check.
   * @returns {data is PaginatedResponse<T>} `true` if the data is a paginated response, otherwise `false`.
   */
  private isPaginatedResponse(data: any): data is PaginatedResponse<T> {
    return (
      data !== null &&
      typeof data === 'object' &&
      'data' in data &&
      'pageOptionsDto' in data &&
      'itemCount' in data &&
      'totalCount' in data
    );
  }
}
