import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { WinstonModule } from 'nest-winston';
import { AuthModule } from '@common/modules/auth';
import { GlobalConfigModule } from '@common/modules/config/global-config.module';
import { LOGGER_CONFIG } from '@common/configs';
import { FinancialModule } from '@core/financial/financial.module';

@Module({
  controllers: [AppController],
  imports: [
    WinstonModule.forRoot(LOGGER_CONFIG),
    GlobalConfigModule,
    ThrottlerModule.forRoot(),
    AuthModule,
    FinancialModule,
  ],
  exports: [],
})
export class AppModule {}
