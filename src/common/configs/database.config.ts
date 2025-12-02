import { registerAs } from '@nestjs/config';
import { ConfigNames } from '../types/enums/configNames.enum';

export interface IDatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

export const getDatabaseConfig = () => {
  const config: IDatabaseConfig = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? +process.env.DB_PORT : 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  };
  return config;
};

export const databaseConfig = registerAs(
  ConfigNames.DATABASE,
  getDatabaseConfig,
);
