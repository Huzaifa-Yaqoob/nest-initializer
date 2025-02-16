import { Transform } from "class-transformer";

export class ResponseUserDto {
  username: string;

  email: string;

  @Transform(({ obj }) => obj._id.toString())
  _id: string;

  token: string;
}
