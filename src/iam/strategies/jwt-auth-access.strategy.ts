import { Inject, Injectable } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import config from "src/config";
import { PayloadToken } from "../models/token.model";

Injectable();
export class JwtAccessTokenStrategy extends PassportStrategy(Strategy, "jwt-access") {
  constructor(@Inject(config.KEY) configService: ConfigType<typeof config>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.session.jwtAccessTokenSecret,
    });
  }
  async validate(payload: PayloadToken) {
    return payload;
  }
}
