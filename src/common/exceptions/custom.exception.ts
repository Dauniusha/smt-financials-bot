import { InternalException } from './internal.exeption';

export class CustomException extends InternalException {
  constructor(message: string) {
    super(message);
  }
}
