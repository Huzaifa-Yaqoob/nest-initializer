import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import {
  Injectable,
  ConflictException,
  BadRequestException,
} from "@nestjs/common";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "./schemas/user.schema";
import { ErrorMessage } from "src/helpers/ErrorMessage";
import { RegisterDto } from "src/auth/dto";

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(registerUserDto: RegisterDto) {
    try {
      // creating user & saving in db
      const { account, ...others } = registerUserDto;
      const createdUser = new this.userModel({ ...others, email: account });
      return await createdUser.save();
    } catch (error) {
      // throwing error if user already exists
      if (error.code === 11000 && error.keyValue) {
        throw new ConflictException([
          new ErrorMessage("email", "User with this email already exist."),
        ]);
      }
      throw new BadRequestException(error);
    }
  }

  async getProfile(id: string) {
    return await this.userModel.findById(id);
  }

  async findOneByAccount(email: string) {
    return await this.userModel.findOne({ email });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
