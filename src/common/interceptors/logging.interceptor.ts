import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // Check if it's a GraphQL request
    const gqlContext = GqlExecutionContext.create(context);
    const isGraphQL = !!gqlContext.getContext().req;

    let method: string;
    let url: string;
    let userAgent: string;
    let ip: string;

    if (isGraphQL) {
      // GraphQL request
      const ctx = gqlContext.getContext();
      const req = ctx.req || ctx;
      method = req.method || 'POST';
      url = req.url || '/graphql';
      userAgent = req.headers?.['user-agent'] || '';
      ip = req.ip || req.connection?.remoteAddress || 'unknown';
    } else {
      // HTTP request
      const request = context.switchToHttp().getRequest();
      if (request) {
        method = request.method || 'UNKNOWN';
        url = request.url || 'UNKNOWN';
        userAgent = request.headers?.['user-agent'] || '';
        ip = request.ip || request.connection?.remoteAddress || 'unknown';
      } else {
        // Fallback if request is not available
        method = 'UNKNOWN';
        url = 'UNKNOWN';
        userAgent = '';
        ip = 'unknown';
      }
    }

    this.logger.log(
      `Incoming Request: ${method} ${url} - User Agent: ${userAgent} - IP: ${ip}`,
    );

    const now = Date.now();
    return next.handle().pipe(
      tap(() => {
        try {
          const response = isGraphQL
            ? gqlContext.getContext().res
            : context.switchToHttp().getResponse();
          
          if (response) {
            const statusCode = response.statusCode || 200;
            const contentLength = response.get?.('content-length') || '';

            this.logger.log(
              `Outgoing Response: ${method} ${url} ${statusCode} ${contentLength} - ${Date.now() - now}ms`,
            );
          }
        } catch (error) {
          // Silently fail if response logging fails
          this.logger.log(
            `Outgoing Response: ${method} ${url} - ${Date.now() - now}ms`,
          );
        }
      }),
    );
  }
}