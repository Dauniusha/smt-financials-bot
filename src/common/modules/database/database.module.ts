import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GlobalConfigModule } from '@common/modules/config/global-config.module';
import { ConfigNames } from '@common/types/enums/configNames.enum';
import { IDatabaseConfig } from '@common/configs/database.config';
import { User } from '@core/users/entities/user';
import { FinancialRequest } from '@core/financial/entities/financial-request';

@Module({
  imports: [
    GlobalConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const dbConfig = configService.get<IDatabaseConfig>(
          ConfigNames.DATABASE,
        );
        return {
          type: 'postgres',
          host: dbConfig.host,
          port: dbConfig.port,
          username: dbConfig.username,
          password: dbConfig.password,
          database: dbConfig.database,
          entities: [User, FinancialRequest],
          migrations: ['dist/migrations/*.js'],
          migrationsRun: true,
          synchronize: false,
        };
      },
    }),
  ],
})
export class DatabaseModule {}
