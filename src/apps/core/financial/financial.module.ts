import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FinancialHistoryRepo, FinancialRequestsRepo } from './repositories';
import { FinancialService } from './financial.service';
import { TypeOrmFinancialRequestsRepo } from './repositories/typeorm-financial-requests.repository';
import { ExcelFinancialHistoryRepo } from './repositories/excel-financial-history.repository';
import { GoogleSheetsModule } from '@common/modules/google-sheets';
import { UsersModule } from '@core/users/users.module';
import { FinancialRequest } from './entities/financial-request';

@Module({
  imports: [
    TypeOrmModule.forFeature([FinancialRequest]),
    GoogleSheetsModule,
    UsersModule,
  ],
  providers: [
    FinancialService,
    { provide: FinancialRequestsRepo, useClass: TypeOrmFinancialRequestsRepo },
    { provide: FinancialHistoryRepo, useClass: ExcelFinancialHistoryRepo },
  ],
  exports: [FinancialService, FinancialRequestsRepo, FinancialHistoryRepo],
})
export class FinancialModule {}
