import { Injectable, BadRequestException } from "@nestjs/common";
import { AuthenticationCommonService } from "./authentication.common.service";
import { SignInPayload } from "../models/signin.model";
import { ErrorService } from "src/errors/error.service";
import { PayloadToken } from "../models/token.model";
import { OtpAuthenticationService } from "./otp-authentication.service";

@Injectable()
export class AuthenticationService {
  constructor(private readonly authcommonService: AuthenticationCommonService, private readonly errorService: ErrorService, private readonly otpAuthenticationService: OtpAuthenticationService) {}

  async signIn(payload: any, tfaCode?: string) {
    try {
      if (payload.isTfaEnabled) {
        const isValid = this.otpAuthenticationService.verifyCode(tfaCode, payload.tfaSecret);

        if (!isValid) {
          throw new BadRequestException("El 2FA ingresado no es correcto");
        }
      }
      /** Data para generar el access y refresh Token */
      const data: PayloadToken = { id: payload.id };

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
      const data: PayloadToken = { id: payload.id };

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
