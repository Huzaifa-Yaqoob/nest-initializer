import { Transform, Expose } from "class-transformer";

export class ResponseUserDto {
  @Expose()
  username: string;

  @Expose()
  email: string;

  @Transform(({ obj }) => obj._id.toString())
  @Expose()
  _id: string;
}
