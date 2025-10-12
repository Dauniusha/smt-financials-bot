import { FinancialHistory } from '@core/financial/entities/financial-history.entity';

export abstract class FinancialHistoryRepo {
  abstract add(history: FinancialHistory): Promise<void>;
  abstract getCurrentBudget(): Promise<{ total: number }>;
}
