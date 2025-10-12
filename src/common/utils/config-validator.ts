import { InternalServerErrorException, Logger } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validateSync, ValidationError } from 'class-validator';
import { AppConfigSchema } from '../configs/app.config.schema';

const configSchemas: any[] = [AppConfigSchema];

export function validateConfig(configuration: Record<string, unknown>) {
  const logger = new Logger('ConfigValidator');

  const result = configSchemas.map((schema) =>
    _validateConfig(configuration, schema),
  );
  const errors = result.flatMap(({ errors }) => errors);
  const finalConfig = result
    .map(({ config }) => config)
    .reduce((acc, obj) => {
      return { ...acc, ...obj };
    }, {});

  for (const err of errors) {
    Object.values(err.constraints).forEach((failMessage) => {
      logger.fatal(failMessage);
    });
  }

  if (errors.length) {
    throw new InternalServerErrorException('Provided config is not valid');
  }

  return finalConfig;
}

function _validateConfig<T extends object>(
  configuration: object,
  cls: new () => T,
): { errors: ValidationError[]; config: T } {
  const finalConfig = plainToClass(cls, configuration, {
    enableImplicitConversion: true,
  });

  return {
    errors: validateSync(finalConfig, { skipMissingProperties: false }),
    config: finalConfig,
  };
}
