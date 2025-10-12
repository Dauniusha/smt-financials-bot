import { registerAs } from '@nestjs/config';
import { ConfigNames } from '../types/enums/configNames.enum';

export interface IAppConfig {
  port: number;
  nodeEnv: string;
  internalApiKey: string;
}

export const getAppConfig = () => {
  const port = process.env.APP_PORT ? +process.env.APP_PORT : 5001;
  const nodeEnv = process.env.APP_NODE_ENV;
  const internalApiKey = process.env.APP_INTERNAL_API_KEY;

  const config: IAppConfig = {
    port: port,
    nodeEnv,
    internalApiKey,
  };
  return config;
};

export const appConfig = registerAs(ConfigNames.APP, getAppConfig);
