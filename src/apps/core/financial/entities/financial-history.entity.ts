import { FinancialRequest } from '@core/financial/entities/financial-request';

export class FinancialHistory {
  static fromRequest(request: FinancialRequest): FinancialHistory {
    const history = new FinancialHistory();
    history.balanceChange = -request.value;
    history.purpose = request.purpose;
    history.comment = request.comment;
    history.date = new Date();
    return history;
  }

  id?: number;
  balanceChange: number;
  purpose: string;
  comment?: string;
  date: Date;
}
