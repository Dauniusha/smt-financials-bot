import { registerAs } from '@nestjs/config';
import { ConfigNames } from '../../types/enums/configNames.enum';

export interface IGoogleSheetsConfig {
  spreadsheetId: string;
  serviceAccountKey?: string;
}

export const getGoogleSheetsConfig = (): IGoogleSheetsConfig => {
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  const serviceAccountKey = process.env.GOOGLE_SHEETS_SERVICE_ACCOUNT_KEY;

  if (!spreadsheetId) {
    throw new Error('GOOGLE_SHEETS_SPREADSHEET_ID is required');
  }

  if (!serviceAccountKey) {
    throw new Error('GOOGLE_SHEETS_SERVICE_ACCOUNT_KEY is required');
  }

  return {
    spreadsheetId,
    serviceAccountKey,
  };
};

export const googleSheetsConfig = registerAs(
  ConfigNames.GOOGLE_SHEETS,
  getGoogleSheetsConfig,
);

export class GoogleSheetsConfig {
  get config(): IGoogleSheetsConfig {
    return getGoogleSheetsConfig();
  }
}
