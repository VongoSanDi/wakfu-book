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

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T | PaginatedResponse<T>, Response<T | T[]>> {
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
