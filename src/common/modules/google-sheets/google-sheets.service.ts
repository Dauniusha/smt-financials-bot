import { Injectable, Logger } from '@nestjs/common';
import { google, sheets_v4 } from 'googleapis';
import { GoogleSheetsConfig } from './google-sheets.config';

@Injectable()
export class GoogleSheetsService {
  private readonly logger = new Logger(GoogleSheetsService.name);
  private sheets: sheets_v4.Sheets;

  constructor(private readonly config: GoogleSheetsConfig) {
    this.initializeGoogleSheets();
  }

  private async initializeGoogleSheets() {
    try {
      const { serviceAccountKey } = this.config.config;

      const auth = new google.auth.GoogleAuth({
        apiKey: serviceAccountKey,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      });

      this.sheets = google.sheets({ version: 'v4', auth });
      this.logger.log('Google Sheets API initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize Google Sheets API', error);
      throw error;
    }
  }

  private async buildFullRange(
    range: string,
    sheetIdentifier?: string | number,
  ): Promise<string> {
    if (!sheetIdentifier) {
      return range;
    }

    let sheetName: string;

    if (typeof sheetIdentifier === 'number') {
      sheetName = await this.getSheetNameByIndex(sheetIdentifier);
    } else {
      sheetName = sheetIdentifier;
    }

    const escapedSheetName =
      sheetName.includes(' ') || sheetName.includes("'")
        ? `'${sheetName.replace(/'/g, "''")}'`
        : sheetName;

    return `${escapedSheetName}!${range}`;
  }

  private async getSheetNameByIndex(index: number): Promise<string> {
    try {
      const response = await this.sheets.spreadsheets.get({
        spreadsheetId: this.config.config.spreadsheetId,
      });

      const sheets = response.data.sheets;
      if (!sheets || index >= sheets.length || index < 0) {
        throw new Error(
          `Sheet with index ${index} not found. Available sheets: ${
            sheets?.length || 0
          }`,
        );
      }

      const sheetName = sheets[index].properties?.title;
      if (!sheetName) {
        throw new Error(`Sheet at index ${index} has no title`);
      }

      return sheetName;
    } catch (error) {
      this.logger.error(`Failed to get sheet name by index ${index}`, error);
      throw error;
    }
  }

  async readRange(
    range: string,
    sheetIdentifier?: string | number,
  ): Promise<any[][]> {
    try {
      const fullRange = await this.buildFullRange(range, sheetIdentifier);

      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.config.config.spreadsheetId,
        range: fullRange,
      });

      return response.data.values || [];
    } catch (error) {
      this.logger.error(
        `Failed to read range ${range} from sheet ${
          sheetIdentifier || 'default'
        }`,
        error,
      );
      throw error;
    }
  }

  async writeRange(
    range: string,
    values: any[][],
    sheetIdentifier?: string | number,
  ): Promise<void> {
    try {
      const fullRange = await this.buildFullRange(range, sheetIdentifier);

      await this.sheets.spreadsheets.values.update({
        spreadsheetId: this.config.config.spreadsheetId,
        range: fullRange,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values,
        },
      });
    } catch (error) {
      this.logger.error(
        `Failed to write to range ${range} in sheet ${
          sheetIdentifier || 'default'
        }`,
        error,
      );
      throw error;
    }
  }

  async appendRow(
    range: string,
    values: any[],
    sheetIdentifier?: string | number,
  ): Promise<void> {
    try {
      const fullRange = await this.buildFullRange(range, sheetIdentifier);

      await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.config.config.spreadsheetId,
        range: fullRange,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [values],
        },
      });
    } catch (error) {
      this.logger.error(
        `Failed to append row to range ${range} in sheet ${
          sheetIdentifier || 'default'
        }`,
        error,
      );
      throw error;
    }
  }
}
