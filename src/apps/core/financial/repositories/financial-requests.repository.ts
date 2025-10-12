import { FinancialRequest } from '@core/financial/entities';

export abstract class FinancialRequestsRepo {
  abstract save(request: FinancialRequest): Promise<FinancialRequest>;
  abstract getById(id: number): Promise<FinancialRequest | null>;
}
