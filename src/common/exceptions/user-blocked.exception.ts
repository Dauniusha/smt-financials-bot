import { CustomException } from './custom.exception';

export class CustomUserBlockedException extends CustomException {
  data?: Record<string, any>;

  constructor(data?: Record<string, any>) {
    super('You have been blocked');
    this.data = data;
  }
}
