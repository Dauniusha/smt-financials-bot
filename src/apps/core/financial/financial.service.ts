import { FinancialRequest } from '@core/financial/entities';
import { FinancialHistory } from '@core/financial/entities/financial-history.entity';
import {
  FinancialHistoryRepo,
  FinancialRequestsRepo,
} from '@core/financial/repositories';
import { UsersRepo } from '@core/users/repositories';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class FinancialService {
  constructor(
    private readonly financialRequestsRepo: FinancialRequestsRepo,
    private readonly financialHistoryRepo: FinancialHistoryRepo,
    private readonly usersRepo: UsersRepo,
  ) {}

  async requestFinance(
    message: string,
    telegramUserId: number,
  ): Promise<FinancialRequest> {
    const user = await this.usersRepo.getByTelegramId(telegramUserId);

    const financialRequest = FinancialRequest.fromPlain(message, user);

    const savedRequest = await this.financialRequestsRepo.save(
      financialRequest,
    );

    return savedRequest;
  }

  async reviewRequest(
    requestId: number,
    approve: boolean,
    reviewerId: number,
  ): Promise<FinancialRequest> {
    const [request, reviewer, budget] = await Promise.all([
      this.financialRequestsRepo.getById(requestId),
      this.usersRepo.getByTelegramId(reviewerId),
      this.financialHistoryRepo.getCurrentBudget(),
    ]);

    if (!request) {
      throw new BadRequestException(`Request with id ${requestId} not found`);
    }

    request.review(approve, budget.total, reviewer);

    await Promise.all([
      this.financialRequestsRepo.save(request),
      approve &&
        this.financialHistoryRepo.add(FinancialHistory.fromRequest(request)),
    ]);

    return request;
  }
}
