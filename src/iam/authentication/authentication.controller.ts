import { Controller, Post, UseGuards, Req, Res } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Request, Response } from "express";
import { LocalAuthGuard } from "../guards/local-auth.guard";
import { User } from "src/users/entities/user.entity";
import { AuthenticationService } from "./authentication.service";
import { JwtAuthRefreshGuard } from "../guards/jwt-auth-refresh.guard";
import { UsersService } from "src/users/users.service";
import { OtpAuthenticationService } from "./otp-authentication.service";
import { toFileStream } from "qrcode";
import { JwtAuthAccessGuard } from "../guards/jwt-auth-access.guard";
import { MaxAttemptsGuard } from "../guards/max-attempts.guard";

@ApiTags("Auth")
@Controller("authentication")
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService, private readonly userService: UsersService, private readonly optAuthenticationService: OtpAuthenticationService) {}

  @UseGuards(LocalAuthGuard, MaxAttemptsGuard)
  @Post("signin")
  async signIn(@Req() req: Request) {
    const user = req.user as User;
    const tfaCode = req.body.tfaCode || null;

    return await this.authService.signIn(user, tfaCode);
  }

  @UseGuards(JwtAuthRefreshGuard)
  @Post("refresh")
  async refresh(@Req() req: Request) {
    const user = req.user as User;
    const refreshToken = req.headers.authorization.split(" ")[1];

    return await this.authService.generateNewAccessToken(user, refreshToken);
  }

  @UseGuards(JwtAuthAccessGuard)
  @Post("tfa/generateqr")
  async generateQrCode(@Req() req: Request, @Res() response: Response) {
    const user = req.user as User;

    const record = await this.userService.findOne(user.id);

    const { secretAuthenticator, uri } = await this.optAuthenticationService.generateSecretAuthenticator(record.email);

    await this.optAuthenticationService.enableStatusTfaForUser(user.id, secretAuthenticator);

    response.type("png");

    return toFileStream(response, uri);
  }
}
