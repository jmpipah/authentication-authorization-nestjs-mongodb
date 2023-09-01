import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { User } from "../../users/entities/user.entity";

@Schema({ timestamps: true })
export class ApiKey extends Document {
  @Prop({ trim: true })
  apiKey: string;

  @Prop({ type: Types.ObjectId, ref: User.name })
  user: User | Types.ObjectId;
}

export const ApiKeySchema = SchemaFactory.createForClass(ApiKey);

ApiKeySchema.methods.toJSON = function () {
  const { __v, ...record } = this.toObject();

  return record;
};
