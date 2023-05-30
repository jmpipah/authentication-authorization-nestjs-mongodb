import { Module } from "@nestjs/common";
import { AuthenticationCommonService, AuthenticationController } from "./authentication";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "src/users/entities/user.entity";
import { HashingService } from "src/providers/hashing/hashing.service";
import { BcryptService } from "src/providers/hashing/bcrypt.service";
import { ErrorsModule } from "src/errors/errors.module";
import { LocalStrategy } from "./strategies/local.strategy";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigType } from "@nestjs/config";
import config from "src/config";
import { JwtAccessTokenStrategy } from "./strategies/jwt-auth-access.strategy";
import { AuthenticationService } from "./authentication/authentication.service";
import { JwtRefreshTokenStrategy } from "./strategies/jwt-auth-refresh.strategy ";

@Module({
  imports: [
    ErrorsModule,
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
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
  providers: [{ provide: HashingService, useClass: BcryptService }, AuthenticationService, AuthenticationCommonService, LocalStrategy, JwtAccessTokenStrategy, JwtRefreshTokenStrategy],
  controllers: [AuthenticationController],
  exports: [AuthenticationService, AuthenticationCommonService],
})
export class IamModule {}
