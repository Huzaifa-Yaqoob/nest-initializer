import { PartialType, PickType } from "@nestjs/mapped-types";
import { User } from "../schemas/user.schema";

export class UpdateUserDto extends PartialType(
  PickType(User, ["username"] as const)
) {}
