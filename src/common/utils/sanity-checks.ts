import { Logger } from '@nestjs/common';
import { PreconditionException } from '../exceptions/precondition.exception';

const _logger = new Logger('AssertionFailure');

export function assertionFailure(message: string) {
  _logger.warn(message);
}

export function assert(condition: boolean, message: string): boolean {
  if (!condition) _logger.warn(message);
  return condition;
}

export function preconditionFailure(message: string) {
  throw new PreconditionException(message);
}

export function precondition(
  condition: boolean,
  message: string,
  source?: string,
) {
  if (!condition) {
    const prefix = (source && source + ': ') || '';
    throw new PreconditionException(`${prefix}${message}`);
  }
}
