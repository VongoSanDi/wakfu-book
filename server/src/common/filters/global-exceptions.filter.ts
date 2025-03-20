import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ApiError } from '../types/api-error.type';
import { HttpAdapterHost } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

/**
 * Global exception filter that handles and formats all unhandled exceptions in the application.
 */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);
  private readonly isDevelopment: boolean;

  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly configService: ConfigService,
  ) {
    this.isDevelopment = this.configService.get('NODE_ENV') !== 'production';
  }

  /**
   * Handles an incoming exception and sends a formatted response.
   */
  catch(exception: Error | HttpException | unknown, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();

    const responseBody = this.formatException(exception, request);

    this.logger.error({
      exception,
      path: request.url,
      method: request.method,
      body: request.body,
      timestamp: responseBody.timestamp,
      stack: (exception as Error).stack,
    });

    httpAdapter.reply(ctx.getResponse(), responseBody, responseBody.statusCode);
  }

  /**
   * Formats the exception into a standardized API error response.
   */
  private formatException(
    exception: Error | HttpException | unknown,
    request: any,
  ): ApiError {
    const defaultResponse: ApiError = {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
      error: 'Internal server error',
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();
      return {
        ...defaultResponse,
        statusCode: exception.getStatus(),
        message:
          typeof exceptionResponse === 'object' &&
          'message' in exceptionResponse
            ? (exceptionResponse.message as string)
            : exception.message,
        error:
          typeof exceptionResponse === 'string'
            ? exception.name
            : (exceptionResponse as any).error,
        parameters: {
          query: request.query,
          body: request.body,
          params: request.params,
        },
        stackLocation: this.isDevelopment
          ? this.getStackLocation(exception)
          : undefined,
      };
    } else if (exception instanceof Error) {
      return {
        ...defaultResponse,
        message: exception.message,
        stackLocation: this.isDevelopment
          ? this.getStackLocation(exception)
          : undefined,
      };
    }
    return defaultResponse;
  }

  /**
   * Extracts the first relevant stack trace line for debugging purposes.
   */
  private getStackLocation(error: Error): string | undefined {
    if (!this.isDevelopment) return undefined;
    const stackLines = error.stack?.split('\n');
    if (!stackLines) return undefined;

    return stackLines
      .find(
        (line, index) =>
          index > 0 && line.includes('at ') && !line.includes('node_modules'),
      )
      ?.trim();
  }
}
