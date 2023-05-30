import { Injectable } from "@nestjs/common";
import { AuthenticationCommonService } from "./authentication.common.service";
import { SignInPayload } from "../models/signin.model";
import { ErrorService } from "src/errors/error.service";
import { PayloadToken } from "../models/token.model";

@Injectable()
export class AuthenticationService {
  constructor(private readonly authcommonService: AuthenticationCommonService, private readonly errorService: ErrorService) {}

  async signIn(payload: SignInPayload) {
    try {
      /** Data para generar el access y refresh Token */
      const data: PayloadToken = { id: payload.id, role: payload.role };

      const [accesstoken, refreshToken] = await Promise.all([this.authcommonService.generateJwtAccessToken(data), this.authcommonService.generateJwtRefreshoken(data)]);

      return {
        message: "Acceso autorizado",
        accesstoken,
        refreshToken,
        user: payload,
      };
    } catch (error) {
      this.errorService.createError(error);
    }
  }

  async generateNewAccessToken(payload: SignInPayload, refreshToken: string) {
    try {
      /** Data para generar el access y refresh Token */
      const data: PayloadToken = { id: payload.id, role: payload.role };

      const accesstoken = await this.authcommonService.generateJwtAccessToken(data);
      const user = await this.authcommonService.findUserAutenticated(payload.id);
      return {
        message: "Acceso autorizado",
        accesstoken,
        refreshToken,
        user,
      };
    } catch (error) {
      this.errorService.createError(error);
    }
  }
}
