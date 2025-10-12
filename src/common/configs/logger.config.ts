import { WinstonModuleOptions } from 'nest-winston';
import * as winston from 'winston';

import { config } from 'dotenv';
config();

const levels = ['error', 'warn', 'info', 'verbose', 'debug'];
const envLevel = process.env.APP_LOG_LEVEL?.toLowerCase();
const isEnvLogLevelValid = envLevel && levels.includes(envLevel);
const level = isEnvLogLevelValid ? envLevel : undefined;

export const LOGGER_CONFIG: WinstonModuleOptions =
  process.env.APP_NODE_ENV === 'local'
    ? {
        transports: [
          new winston.transports.Console({
            level,
            format: winston.format.combine(
              winston.format.colorize(),
              winston.format.timestamp(),
              winston.format.cli(),
            ),
          }),
        ],
      }
    : {
        transports: [
          new winston.transports.Console({
            level,
            format: winston.format.combine(
              winston.format.timestamp(),
              winston.format.json(),
            ),
          }),
        ],
      };
