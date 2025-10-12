import { FinancialRequest } from '@core/financial/entities';
import { FinancialRequestsRepo } from './financial-requests.repository';
import { plainToInstance } from 'class-transformer';

export class LocalFinancialRequestsRepo implements FinancialRequestsRepo {
  private static readonly requests: FinancialRequest[] = [
    plainToInstance(FinancialRequest, {
      id: 1,
      date: new Date(),
      value: 12.12,
      purpose: 'Birthdays',
      comment: 'September birthday gifts',
      preferredPaymentMethod: 'Cash',
      userId: 1,
    }),
  ];

  async save(request: FinancialRequest): Promise<FinancialRequest> {
    const id = Math.floor(Math.random() * 10000);
    request.id = id;
    LocalFinancialRequestsRepo.requests.push(request);
    return request;
  }

  async getById(id: number): Promise<FinancialRequest | null> {
    return LocalFinancialRequestsRepo.requests.find(
      (request) => id === request.id,
    );
  }
}
