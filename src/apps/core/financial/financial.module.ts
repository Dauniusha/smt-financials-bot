import { Module } from '@nestjs/common';
import { FinancialHistoryRepo, FinancialRequestsRepo } from './repositories';
import { FinancialService } from './financial.service';
import { LocalFinancialRequestsRepo } from './repositories/local-financial-requests.repository';
import { ExcelFinancialHistoryRepo } from './repositories/excel-financial-history.repository';
import { GoogleSheetsModule } from '@common/modules/google-sheets';
import { UsersModule } from '@core/users/users.module';

@Module({
  imports: [GoogleSheetsModule, UsersModule],
  providers: [
    FinancialService,
    { provide: FinancialRequestsRepo, useClass: LocalFinancialRequestsRepo },
    { provide: FinancialHistoryRepo, useClass: ExcelFinancialHistoryRepo },
  ],
  exports: [FinancialService, FinancialRequestsRepo, FinancialHistoryRepo],
})
export class FinancialModule {}
