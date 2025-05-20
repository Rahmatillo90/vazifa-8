import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      map((res: { data?: object; message?: string }) => {
        const response: { success: boolean; message?: string; data?: object } =
          {
            success: true,
          };
        if (res.message) {
          response.message = res.message;
        }
        if (res.data) {
          response.data = res.data;
        }
        return response;
      }),
    );
  }
}
