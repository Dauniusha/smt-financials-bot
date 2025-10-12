import { Injectable, Logger } from '@nestjs/common';
import { FinancialHistoryRepo } from './financial-history.repository';
import { FinancialHistory } from '@core/financial/entities/financial-history.entity';
import { GoogleSheetsService } from '@common/modules/google-sheets';

@Injectable()
export class ExcelFinancialHistoryRepo implements FinancialHistoryRepo {
  private readonly logger = new Logger(ExcelFinancialHistoryRepo.name);
  private readonly sheetIdentifier = 0;

  constructor(private readonly googleSheetsService: GoogleSheetsService) {}

  getSheet(): number {
    return this.sheetIdentifier;
  }

  async add(history: FinancialHistory): Promise<void> {
    try {
      const existingData = await this.googleSheetsService.readRange(
        'A4:G1000',
        this.sheetIdentifier,
      );
      const nextRow = 4 + existingData.length;

      const rowValues = [
        history.balanceChange, // BYN
        0, // USD (Not supported)
        history.purpose,
        history.comment || '',
        '', // BYN after total
        '', // USD after total
        history.date,
      ];

      await this.googleSheetsService.writeRange(
        `A${nextRow}:G${nextRow}`,
        [rowValues],
        this.sheetIdentifier,
      );
    } catch (error) {
      this.logger.error('Failed to add financial history', error);
      throw error;
    }
  }

  async getCurrentBudget(): Promise<{ total: number }> {
    try {
      const values = await this.googleSheetsService.readRange(
        'B2',
        this.sheetIdentifier,
      );

      if (!values.length || !values[0].length) {
        throw new Error('Insufficient data in spreadsheet');
      }

      const bynValue = +(values[0][0].replace(',', '.') || 0) * 100;

      return { total: bynValue };
    } catch (error) {
      this.logger.error('Failed to get current budget', error);
      throw error;
    }
  }
}
