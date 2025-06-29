import { Exclude, Expose } from 'class-transformer';

export class UserResponseDto {
  @Expose()
  _id: string;

  @Expose()
  email: string;

  @Expose()
  name: string;

  @Exclude()
  password: string;
}
