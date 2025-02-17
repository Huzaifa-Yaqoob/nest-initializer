import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
} from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "./schemas/user.schema";
import { SignInUserDto } from "./dto/sign-in-user.dto";
import { JwtService } from "@nestjs/jwt";
import { ErrorMessage } from "src/helpers/ErrorMessage";
import configuration from "src/configuration";

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

  async createUser(createUserDto: CreateUserDto) {
    try {
      // creating user & saving in db
      const createdUser = new this.userModel(createUserDto);
      const payload: Payload = {
        _id: createdUser._id.toString(),
        email: createdUser.email,
      };
      const token = await this.jwtService.signAsync(payload);

      return createdUser;
    } catch (error) {
      // throwing error if user already exists
      if (error.code === 11000 && error.keyValue) {
        throw new ConflictException([
          new ErrorMessage("email", "User with this email already exist."),
        ]);
      }
      throw error;
    }
  }

  async signIn(signInUserDto: SignInUserDto) {
    const signInUser = await this.userModel.findOne({
      email: signInUserDto.email,
    });

    // checking email
    if (!signInUser) {
      throw new UnauthorizedException([
        new ErrorMessage("email", "This email is not registered."),
      ]);
    }

    // comparing password
    if (!(await signInUser.comparePassword(signInUserDto.password))) {
      throw new UnauthorizedException([
        new ErrorMessage("password", "Please enter a correct password."),
      ]);
    }

    // generating token
    const payload: Payload = {
      _id: signInUser._id.toString(),
      email: signInUser.email,
    };
    const token = await this.jwtService.signAsync(payload);

    return signInUser;
  }

  async verifyUser(token: string) {
    // verifying token and throwing error if token invalid
    const payload = await this.jwtService
      .verifyAsync<Payload>(token, {
        secret: configuration.jwt.secret,
      })
      .catch(() => {
        throw new UnauthorizedException([
          new ErrorMessage(
            "general",
            "Your token has expired you need to login again."
          ),
        ]);
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

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
