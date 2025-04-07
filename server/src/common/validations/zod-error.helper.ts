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
    const zodError = result.error;
    const formattedErrors = zodError.format();

    const flatErrors = zodError.errors.map((e) => e.message).filter(Boolean)
    const finalMessage = flatErrors.length > 0 ? flatErrors : [options.message]

    if (options.logError) {
      logger.warn(
        `Validation error: ${options.message}`,
        JSON.stringify(formattedErrors, null, 2)
      );
    }
    throw new BadRequestException({
      message: finalMessage,
      errors: formattedErrors
    });
  }
  return result.data;
}
