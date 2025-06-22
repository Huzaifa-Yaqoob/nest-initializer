import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ unique: true, required: true })
  email: string;

  @Prop({ required: true, minlength: 3, maxlength: 50 })
  name: string;

  @Prop({ required: true, maxlength: 32, minlength: 8 })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
