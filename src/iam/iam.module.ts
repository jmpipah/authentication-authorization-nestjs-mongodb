import { Module } from "@nestjs/common";
import { AuthenticationCommonService, AuthenticationController } from "./authentication";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "src/users/entities/user.entity";
import { HashingService } from "src/providers/hashing/hashing.service";
import { BcryptService } from "src/providers/hashing/bcrypt.service";
import { ErrorsModule } from "src/errors/errors.module";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigType } from "@nestjs/config";
import config from "src/config";
import { AuthenticationService } from "./authentication/authentication.service";
import { JwtAccessTokenStrategy, JwtRefreshTokenStrategy, LocalStrategy } from "./strategies";
import { OtpAuthenticationService } from "./authentication/otp-authentication.service";
import { UsersService } from "src/users/users.service";
import { ApiKeyService } from "src/api-key/api-key.service";
import { ApiKey, ApiKeySchema } from "src/api-key/entities/api-key.entity";
import { UsersModule } from "src/users/users.module";

@Module({
  imports: [
    ErrorsModule,
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: ApiKey.name,
        schema: ApiKeySchema,
      },
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [config.KEY],
      useFactory: async (configService: ConfigType<typeof config>) => {
        return {
          secret: configService.session.jwtAccessTokenSecret,
          signOptions: {
            expiresIn: configService.session.jwtAccessTokenExpiresTime,
          },
        };
      },
    }),
  ],
  providers: [
    { provide: HashingService, useClass: BcryptService },
    AuthenticationService,
    AuthenticationCommonService,
    LocalStrategy,
    JwtAccessTokenStrategy,
    JwtRefreshTokenStrategy,
    OtpAuthenticationService,
    ApiKeyService,
    UsersService,
  ],
  controllers: [AuthenticationController],
  exports: [AuthenticationService, AuthenticationCommonService],
})
export class IamModule {}
