import { Controller, Post, Body, UseGuards, Req } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AuthenticationCommonService } from "./authentication.common.service";
import { Request } from "express";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { User } from "src/users/entities/user.entity";

@ApiTags("Auth")
@Controller("authentication")
export class AuthenticationController {
  constructor(private readonly authCommonService: AuthenticationCommonService) {}

  @UseGuards(LocalAuthGuard)
  @Post("signin")
  async signIn(@Req() req: Request) {
    const user = req.user as User;

    return user;
  }
}
