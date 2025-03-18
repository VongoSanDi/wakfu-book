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

  catch(exception: unknown, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();

    let responseBody: ApiError = {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
      error: 'Internal server error',
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
    };

    const getStackLocation = (error: Error): string | undefined => {
      if (!this.isDevelopment) return undefined;
      const stackLines = error.stack?.split('\n');
      if (!stackLines) return undefined;

      const locationLine = stackLines.find((line, index) => {
        return (
          index > 0 && line.includes('at ') && !line.includes('node_modules')
        );
      });

      return locationLine?.trim();
    };

    const queryParams = request.query;
    const bodyParams = request.body;
    const urlParams = request.params;

    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();
      const stackLocation = getStackLocation(exception);
      responseBody = {
        ...responseBody,
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
          query: queryParams,
          body: bodyParams,
          params: urlParams,
        },
        ...(stackLocation && { stackLocation }),
      };
    } else if (exception instanceof Error) {
      const stackLocation = getStackLocation(exception);
      responseBody = {
        ...responseBody,
        message: exception.message,
        ...(stackLocation && { stackLocation }),
      };
    }

    if (responseBody.parameters?.body?.password) {
      responseBody.parameters.body.password = '***';
    }
    if (responseBody.parameters?.body?.password_hash) {
      responseBody.parameters.body.password_hash = '***';
    }

    this.logger.error({
      exception,
      path: request.url,
      method: request.method,
      body: request.body,
      user: request.user,
      timestamp: responseBody.timestamp,
      stack: (exception as Error).stack,
    });

    httpAdapter.reply(ctx.getResponse(), responseBody, responseBody.statusCode);
  }
}
