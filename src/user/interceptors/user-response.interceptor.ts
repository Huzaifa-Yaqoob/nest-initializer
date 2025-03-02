import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { plainToInstance, instanceToPlain } from "class-transformer";
import { map, Observable } from "rxjs";
import { UserDocument } from "../schemas/user.schema";
import { ResponseUserDto } from "../dto/response-user.dto";

@Injectable()
export class UserResponse implements NestInterceptor {
  constructor() {}
  intercept(
    context: ExecutionContext,
    next: CallHandler<UserDocument>
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map((data) => {
        return this.transform(data);
      })
    );
  }

  private async transform(document: UserDocument) {
    const plainObject = document.toObject();

    return instanceToPlain(
      plainToInstance(ResponseUserDto, plainObject, {
        excludeExtraneousValues: true,
      })
    );
  }
}
