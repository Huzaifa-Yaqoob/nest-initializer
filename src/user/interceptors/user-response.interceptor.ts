import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { map, Observable } from "rxjs";
import { UserDocument } from "../schemas/user.schema";
import { JwtService } from "@nestjs/jwt";
import { ResponseUserDto } from "../dto/response-user.dto";
import { plainToInstance, instanceToPlain } from "class-transformer";

interface Payload {
  _id: string;
  email: string;
}

@Injectable()
export class UserResponse implements NestInterceptor {
  constructor(private readonly jwtService: JwtService) {}
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

  private async transform(document: UserDocument & { token?: string }) {
    const plainObject = document.toObject();
    const payload: Payload = {
      _id: plainObject._id.toString(),
      email: plainObject.email,
    };

    let token = document.token;
    if (!token) {
      token = await this.jwtService.signAsync(payload);
    }
    return instanceToPlain(
      plainToInstance(ResponseUserDto, { ...plainObject, token })
    );
  }
}
