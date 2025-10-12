import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { IAppConfig } from '@common/configs/app.config';
import { CustomExceptionFilter } from '@common/filters/custom-exception.filter';
import { ConfigNames } from '@common/types/enums/configNames.enum';
import { setupSwagger } from '@common/utils/setupSwagger';
import { AppModule } from './app.module';
import { mw as ipMiddleware } from 'request-ip';
import { NestExpressApplication } from '@nestjs/platform-express';
import { WINSTON_MODULE_NEST_PROVIDER, WinstonModule } from 'nest-winston';
import { LOGGER_CONFIG } from '@common/configs';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    forceCloseConnections: true,
    logger: WinstonModule.createLogger(LOGGER_CONFIG),
  });
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  app.setGlobalPrefix('api');

  app.use(helmet());

  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.set('trust proxy', 1);

  app.use(ipMiddleware());
  app.use(cookieParser());
  app.enableCors({
    credentials: true,
    origin: true,
  });
  app.useGlobalPipes(new ValidationPipe({}));
  app.useGlobalFilters(new CustomExceptionFilter());

  setupSwagger(app);

  const configService = app.get(ConfigService);
  const config = configService.get<IAppConfig>(ConfigNames.APP);

  if (!config) {
    throw new Error('App config does not exists');
  }

  const logger = new Logger('App');

  await app.listen(config.port, () => {
    logger.log(`Server successfully started on port ${config.port}`);
  });
}
bootstrap();
