import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  data: T;
  meta?: any;
}

@Injectable()
export class PaginationInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        // If it's a pagination result, transform it
        if (data && data.data && data.meta) {
          return {
            success: true,
            data: data.data,
            meta: data.meta,
            timestamp: new Date().toISOString(),
          };
        }
        
        // If it's a single item, wrap it in a consistent response
        return {
          success: true,
          data: data,
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }
}