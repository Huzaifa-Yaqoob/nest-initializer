import * as bcrypt from "bcryptjs";
import { UserSchema, UserDocument } from "../schemas/user.schema";

export default function schemaMiddleware() {
  const schema = UserSchema;

  schema.pre("save", async function (next) {
    const user = this as UserDocument;
    if (!user.isModified("password")) return next();

    try {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
      next();
    } catch (error) {
      next(error);
    }
  });

  schema.methods.comparePassword = async function (
    enteredPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(enteredPassword, this.password);
  };

  return schema;
}
