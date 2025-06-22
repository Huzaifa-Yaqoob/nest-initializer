import { PartialType, PickType } from '@nestjs/mapped-types';
import { CreateUserDto } from '../../user/dto';

export class LoginUserDto extends PartialType(
  PickType(CreateUserDto, ['email', 'password'] as const),
) {}
