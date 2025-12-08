import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    this.logger.error(
      `HTTP Status: ${status} Error: ${JSON.stringify(message)}`,
      exception instanceof Error ? exception.stack : '',
    );

    // Try to get HTTP context
    try {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      const request = ctx.getRequest<Request>();

      // Check if response has status function (HTTP context)
      if (response && typeof response.status === 'function') {
        response.status(status).json({
          statusCode: status,
          timestamp: new Date().toISOString(),
          path: request?.url || 'unknown',
          message: typeof message === 'string' ? message : (message as any).message,
        });
      } else {
        // GraphQL context - errors are handled by GraphQL layer
        // Just log the error
        this.logger.debug('GraphQL error - handled by GraphQL layer');
      }
    } catch (error) {
      // If switchToHttp fails, it's likely a GraphQL context
      // GraphQL will handle the error response
      this.logger.debug('GraphQL error - handled by GraphQL layer');
    }
  }
}