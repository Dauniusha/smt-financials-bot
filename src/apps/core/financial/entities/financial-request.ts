import { CustomBadRequestException } from '@common/exceptions/custom-bad-request.exception';
import { User } from '@core/users/entities/user';
import { plainToInstance } from 'class-transformer';

export enum RequestStatus {
  Waiting = 'waiting',
  Approved = 'approved',
  Canceled = 'canceled',
  Rejected = 'rejected',
}

export class FinancialRequest {
  /**
   * @param message special typed message, example:
   *
   * Value: 12,12
   * Purpose: Birthdays
   * Comment: September birthday gifts
   * Payment method: Cash
   */
  static fromPlain(message: string, user: User): FinancialRequest {
    const lines = message
      .trim()
      .split('\n')
      .filter((line) => line.trim() !== '');

    if (lines.length < 4) {
      throw new CustomBadRequestException('Invalid message format.');
    }

    const [value, purpose, comment, preferredPaymentMethod] = lines.map(
      (line) => line.substring(line.indexOf(':') + 1).trim(),
    );

    const numericValue = +value.replace(',', '.');

    if (isNaN(numericValue)) {
      throw new CustomBadRequestException('Invalid requested budget.');
    }

    return plainToInstance(FinancialRequest, {
      value: numericValue * 100,
      purpose,
      comment: comment || undefined,
      preferredPaymentMethod: preferredPaymentMethod || 'cash',
      userId: user.id,
      user: user,
    });
  }

  id?: number;
  value: number;
  purpose: string;
  comment?: string;
  userId: string;
  user?: User;
  status: RequestStatus = RequestStatus.Waiting;
  date: Date = new Date();
  preferredPaymentMethod?: string;
  reviewerId?: string;
  reviewer?: User;
  reviewedAt?: Date;

  review(approve: boolean, currentBalance: number, reviewer: User) {
    if (reviewer.role !== 'admin') {
      throw new CustomBadRequestException(`Reviewer should be admin.`);
    }

    if (this.status !== RequestStatus.Waiting) {
      throw new CustomBadRequestException(`Request is already reviewed.`);
    }

    if (approve && this.value > currentBalance) {
      throw new CustomBadRequestException(
        `Try to approve over budget request.`,
      );
    }

    this.reviewerId = reviewer.id;
    this.reviewer = reviewer;
    this.status = approve ? RequestStatus.Approved : RequestStatus.Rejected;
    this.reviewedAt = new Date();
  }
}
