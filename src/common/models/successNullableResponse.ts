import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiProperty,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { MessageResponse } from './messageResponse';

export class SuccessNullable extends MessageResponse {
  @ApiProperty({ nullable: true, default: null })
  public data = null;

  constructor() {
    super('Success');
  }
}

export const ApiOkNullableResponse = () =>
  applyDecorators(
    ApiExtraModels(SuccessNullable),
    ApiResponse({
      status: HttpStatus.ACCEPTED,
      schema: {
        allOf: [{ $ref: getSchemaPath(SuccessNullable) }],
      },
    }),
  );
