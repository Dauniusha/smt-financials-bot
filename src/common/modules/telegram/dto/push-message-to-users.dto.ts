import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class PushMessagesToUsersDTO {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  message: string;
}
