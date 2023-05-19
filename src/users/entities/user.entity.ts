import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ unique: true, index: true, trim: true })
  email: string;

  @Prop({ trim: true })
  password: string;

  @Prop({ trim: true })
  firstName: string;

  @Prop({ trim: true })
  lastName: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.methods.toJSON = function () {
  const { __v, password, ...record } = this.toObject();

  return record;
};

UserSchema.post("save", function (error, doc, next) {
  if (error.name === "MongoServerError" && error.code === 11000) {
    next(new Error(`El ${Object.keys(error.keyValue)} ya existe`));
  } else {
    next();
  }
});
