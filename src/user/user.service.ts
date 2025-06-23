import { Model } from 'mongoose';
import {
  BadGatewayException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto';
import { UserDocument, User } from './entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const newUser = new this.userModel(createUserDto);
    return await newUser.save();
  }

  async loginUser(email: string, password: string) {
    const foundUser = await this.userModel.findOne({ email });
    if (!foundUser) {
      throw new NotFoundException("User doesn't exist");
    }
    const isMatch = await foundUser.comparePassword(password);
    if (!isMatch) {
      throw new BadGatewayException('Invalid Password');
    }
    return foundUser;
  }

  async findOneById(id: string) {
    return this.userModel.findById(id);
  }
}
