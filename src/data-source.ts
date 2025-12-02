import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { User } from './apps/core/users/entities/user';
import { FinancialRequest } from './apps/core/financial/entities/financial-request';

config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [User, FinancialRequest],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
});
