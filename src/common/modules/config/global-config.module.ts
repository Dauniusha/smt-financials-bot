import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { appConfig, telegramConfig } from '@common/configs';
import { validateConfig } from '@common/utils/config-validator';
import { ConfigNames } from '@common/types/enums/configNames.enum';
import { IAppConfig } from '../../configs/app.config';
import { ITelegramConfig } from '../../configs/telegram.config';
import { databaseConfig, IDatabaseConfig } from '../../configs/database.config';
import {
  googleSheetsConfig,
  IGoogleSheetsConfig,
} from '../google-sheets/google-sheets.config';

@Global()
@Module({
  providers: [
    {
      provide: ConfigNames.APP,
      useFactory: (configService: ConfigService): IAppConfig => {
        return configService.getOrThrow<IAppConfig>(ConfigNames.APP);
      },
      inject: [ConfigService],
    },
    {
      provide: ConfigNames.TELEGRAM,
      useFactory: (configService: ConfigService): ITelegramConfig => {
        return configService.getOrThrow<ITelegramConfig>(ConfigNames.TELEGRAM);
      },
      inject: [ConfigService],
    },
    {
      provide: ConfigNames.DATABASE,
      useFactory: (configService: ConfigService): IDatabaseConfig => {
        return configService.getOrThrow<IDatabaseConfig>(ConfigNames.DATABASE);
      },
      inject: [ConfigService],
    },
    {
      provide: ConfigNames.GOOGLE_SHEETS,
      useFactory: (configService: ConfigService): IGoogleSheetsConfig => {
        return configService.getOrThrow<IGoogleSheetsConfig>(
          ConfigNames.GOOGLE_SHEETS,
        );
      },
      inject: [ConfigService],
    },
  ],
  imports: [
    ConfigModule.forRoot({
      load: [appConfig, telegramConfig, databaseConfig, googleSheetsConfig],
      isGlobal: true,
      validate: validateConfig,
    }),
  ],
  exports: [
    ConfigNames.APP,
    ConfigNames.TELEGRAM,
    ConfigNames.DATABASE,
    ConfigNames.GOOGLE_SHEETS,
  ],
})
export class GlobalConfigModule {}
