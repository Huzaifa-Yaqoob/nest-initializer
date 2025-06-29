import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserResponseDto } from '../auth/dto/user-response.dto';

@Injectable()
export class SingleUserDataInterceptor implements NestInterceptor {
  intercept(_: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        return plainToInstance(UserResponseDto, data, {
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
