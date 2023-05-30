import { Controller, Post, Body, UseGuards, Req } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Request } from "express";
import { LocalAuthGuard } from "../guards/local-auth.guard";
import { User } from "src/users/entities/user.entity";
import { AuthenticationService } from "./authentication.service";
import { JwtAuthRefreshGuard } from "../guards/jwt-auth-refresh.guard";
import { ref } from "joi";

@ApiTags("Auth")
@Controller("authentication")
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService) {}

  @UseGuards(LocalAuthGuard)
  @Post("signin")
  async signIn(@Req() req: Request) {
    const user = req.user as User;

    return await this.authService.signIn(user);
  }

  @UseGuards(JwtAuthRefreshGuard)
  @Post("refresh")
  async refresh(@Req() req: Request) {
    const user = req.user as User;
    const refreshToken = req.headers.authorization.split(" ")[1];

    return await this.authService.generateNewAccessToken(user, refreshToken);
  }
}
