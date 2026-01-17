import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * WHAT: Response transformation interceptor
 * 
 * WHY: Provides consistent response format across all API endpoints
 * Wraps all successful responses in a standard structure
 * 
 * HOW: Intercepts responses and transforms them before sending to client
 */
export interface Response<T> {
  success: boolean;
  data: T;
  message?: string;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    // WHY: Transform successful responses to include success flag and data wrapper
    return next.handle().pipe(
      map((data) => ({
        success: true,
        data,
        // WHY: Optional message field for additional context
        message: data?.message,
      })),
    );
  }
}

