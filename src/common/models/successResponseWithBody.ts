import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiProperty,
  getSchemaPath,
} from '@nestjs/swagger';
import { PaginatedResponseDto } from '../base-classes/pagination.dto';
import { MessageResponse } from './messageResponse';

export class SuccessResponseWithBody<T> extends MessageResponse {
  @ApiProperty({ nullable: true })
  public data: T | null;

  constructor(body: T) {
    super('Success');
    this.data = body;
  }
}

export const ApiOkResponseWithBody = <DataDto extends Type<unknown>>(
  dataDto: DataDto,
) =>
  applyDecorators(
    ApiExtraModels(SuccessResponseWithBody, dataDto),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(SuccessResponseWithBody) },
          {
            properties: {
              data: { $ref: getSchemaPath(dataDto) },
            },
          },
        ],
      },
    }),
  );

export const ApiOkResponseWithArray = <DataDto extends Type<unknown>>(
  dataDto: DataDto,
) =>
  applyDecorators(
    ApiExtraModels(SuccessResponseWithBody, dataDto),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(SuccessResponseWithBody) },
          {
            properties: {
              data: { type: 'array', items: { $ref: getSchemaPath(dataDto) } },
            },
          },
        ],
      },
    }),
  );

export const ApiOkResponsePaginated = <DataDto extends Type<unknown>>(
  dataDto: DataDto,
) =>
  applyDecorators(
    ApiExtraModels(PaginatedResponseDto, dataDto),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(PaginatedResponseDto) },
          {
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(dataDto) },
              },
            },
          },
        ],
      },
    }),
  );
