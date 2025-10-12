import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  UnauthorizedException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { CustomException } from '../exceptions/custom.exception';
import { CustomUserBlockedException } from '../exceptions/user-blocked.exception';
import { CustomBadRequestException } from '../exceptions/custom-bad-request.exception';

@Catch(
  CustomException,
  CustomUserBlockedException,
  UnauthorizedException,
  CustomBadRequestException,
  InternalServerErrorException,
)
export class CustomExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(CustomExceptionFilter.name);

  catch(exception: CustomException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof CustomUserBlockedException) {
      return response.status(HttpStatus.FORBIDDEN).json({
        data: exception.data,
        statusCode: HttpStatus.FORBIDDEN,
        message: exception.message,
        error: 'Forbidden',
        timestamp: new Date().toISOString(),
      });
    } else if (exception instanceof InternalServerErrorException) {
      this.logger.error(
        `Internal Server Error: ${exception.message}`,
        exception.stack,
      );

      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: exception.message,
        error: 'Internal Server Error',
        timestamp: new Date().toISOString(),
      });
    } else if (exception instanceof UnauthorizedException) {
      return response.status(HttpStatus.UNAUTHORIZED).json({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: exception.message,
        error: 'Unauthorized',
        timestamp: new Date().toISOString(),
      });
    } else {
      response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: exception.message,
        error: 'Bad request',
        timestamp: new Date().toISOString(),
      });
    }
  }
}
