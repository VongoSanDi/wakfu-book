import { BadRequestException, Logger } from '@nestjs/common';
import { SafeParseReturnType } from 'zod';

interface ValidationOptions {
  message: string;
  logError?: boolean;
}

const logger = new Logger('ZodValidationHelper', { timestamp: true });

/**
 * Manage Zod validation and throw a BadRequestException if something is wrong
 * @param result safeParse result
 * @param options Validation options
 * @returns Return validated datas <T>, never undefined
 */
export function handleZodValidation<T>(
  result: SafeParseReturnType<T, T>,
  options: ValidationOptions,
): T {
  if (!result.success) {
    if (options.logError) {
      logger.warn(
        `Validation error: ${options.message}`,
        result.error.format(),
      );
    }
    throw new BadRequestException({
      message: options.message,
      errors: result.error.format(),
    });
  }
  return result.data;
}
