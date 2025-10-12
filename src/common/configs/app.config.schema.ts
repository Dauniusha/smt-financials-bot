import { IsDefined, IsNumber, IsString } from 'class-validator';

export class AppConfigSchema {
  @IsDefined()
  @IsNumber()
  APP_PORT: number;

  @IsDefined()
  @IsString()
  APP_NODE_ENV: string;

  @IsDefined()
  @IsString()
  APP_INTERNAL_API_KEY: string;
}
