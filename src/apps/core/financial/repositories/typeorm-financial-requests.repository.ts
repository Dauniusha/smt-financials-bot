import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FinancialRequest } from '@core/financial/entities';
import { FinancialRequestsRepo } from './financial-requests.repository';

@Injectable()
export class TypeOrmFinancialRequestsRepo implements FinancialRequestsRepo {
  constructor(
    @InjectRepository(FinancialRequest)
    private readonly requestRepository: Repository<FinancialRequest>,
  ) {}

  async save(request: FinancialRequest): Promise<FinancialRequest> {
    return this.requestRepository.save(request);
  }

  async getById(id: number): Promise<FinancialRequest | null> {
    return this.requestRepository.findOne({
      where: { id },
      relations: ['user', 'reviewer'],
    });
  }
}
