import { Logger } from '@nestjs/common';
import { GrammyError } from 'grammy';

/**
 * @returns true if error's handled and false in the other case
 */
export function handleBotException(error: unknown, logger: Logger): boolean {
  if (
    error instanceof GrammyError &&
    error.error_code >= 400 &&
    error.error_code < 500
  ) {
    logger.warn(error.description);
    return true;
  }
  return false;
}
