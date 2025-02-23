import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import {
  Injectable,
  ConflictException,
  BadRequestException,
  NotFoundException,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "./schemas/user.schema";
import { JwtService } from "@nestjs/jwt";
import { ErrorMessage } from "src/helpers/ErrorMessage";
import configuration from "src/config/general.config";
import { RegisterDto } from "src/auth/dto";
import { validateOrReject } from "class-validator";
import { plainToInstance } from "class-transformer";

// useful types
interface Payload {
  email: string;
  _id: string;
}

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService
  ) {}

  @UsePipes(new ValidationPipe())
  async create(registerUserDto: RegisterDto) {
    const registerDto = plainToInstance(RegisterDto, registerUserDto);
    try {
      await validateOrReject(registerDto);
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

  async verifyUser(token: string) {
    // verifying token and throwing error if token invalid
    const payload = await this.jwtService.verifyAsync<Payload>(token, {
      secret: configuration.jwt.secret,
    });

    // finding user and throwing error if not found
    const verifiedUser = await this.userModel.findById(payload._id);
    if (!verifiedUser) {
      throw new NotFoundException([
        new ErrorMessage("general", "User not found."),
      ]);
    }
    return { ...verifiedUser, token };
  }

  findAll() {
    return `This action returns all user`;
  }

  async findOne(email: string) {
    console.log(email);
    return await this.userModel.findOne({ email });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
