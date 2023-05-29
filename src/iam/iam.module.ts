import { Module } from "@nestjs/common";
import { AuthenticationCommonService, AuthenticationController } from "./authentication";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "src/users/entities/user.entity";
import { HashingService } from "src/providers/hashing/hashing.service";
import { BcryptService } from "src/providers/hashing/bcrypt.service";
import { ErrorsModule } from "src/errors/errors.module";

@Module({
  imports: [
    ErrorsModule,
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  providers: [{ provide: HashingService, useClass: BcryptService }, AuthenticationCommonService],
  controllers: [AuthenticationController],

  exports: [],
})
export class IamModule {}
