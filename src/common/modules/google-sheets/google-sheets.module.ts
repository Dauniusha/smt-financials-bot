import { GoogleSheetsConfig } from './google-sheets.config';
import { GoogleSheetsService } from './google-sheets.service';
import { Module } from '@nestjs/common';

@Module({
  providers: [GoogleSheetsService, GoogleSheetsConfig],
  exports: [GoogleSheetsService],
})
export class GoogleSheetsModule {}
