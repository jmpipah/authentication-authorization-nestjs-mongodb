import { Controller, Post, Body } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AuthenticationCommonService } from "./authentication.common.service";
import { Request } from "express";
import { SignInDto } from "./dto/signin-auth.dto";

@ApiTags("Auth")
@Controller("authentication")
export class AuthenticationController {
  constructor(private readonly authCommonService: AuthenticationCommonService) {}

  @Post("signin")
  async signIn(@Body() payload: SignInDto) {
    return this.authCommonService.findUserAuthenticated(payload);
  }
}
