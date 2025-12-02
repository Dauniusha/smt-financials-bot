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
        Number((history.balanceChange / 100).toFixed(2)), // BYN
        '', // USD (Not supported)
        history.purpose,
        history.comment || '',
      ];

      await Promise.all([
        this.googleSheetsService.writeRange(
          `A${nextRow}:D${nextRow}`,
          [rowValues],
          this.sheetIdentifier,
        ),
        this.googleSheetsService.writeRange(
          `G${nextRow}`,
          [[this.formatDateForExcel(history.date)]],
          this.sheetIdentifier,
        ),
      ]);
    } catch (error) {
      this.logger.error('Failed to add financial history', error);
      throw error;
    }
  }

  private formatDateForExcel(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}.${day}.${year}`;
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
