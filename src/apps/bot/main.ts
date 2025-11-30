import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LOGGER_CONFIG } from '@common/configs';
import { WINSTON_MODULE_NEST_PROVIDER, WinstonModule } from 'nest-winston';
import { ConfigService } from '@nestjs/config';
import { ConfigNames } from '@common/types/enums/configNames.enum';
import { IAppConfig } from '@common/configs/app.config';
import { Logger } from '@nestjs/common';
import { CustomExceptionFilter } from '@common/filters/custom-exception.filter';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule, {
      logger: WinstonModule.createLogger(LOGGER_CONFIG),
    });
    app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
    const configService = app.get(ConfigService);
    const config = configService.get<IAppConfig>(ConfigNames.APP);

    if (!config) throw new Error('App config does not exists');

    app.useGlobalFilters(new CustomExceptionFilter());

    const logger = new Logger('App');

    await app.listen(config.port, async () => {
      logger.log(`Server successfully started on port ${config.port}`);
    });
  } catch (err) {
    console.error('Error during server bootstrap:', err);
    process.exit(1);
  }
}

bootstrap();
