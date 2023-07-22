import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { authenticator } from "otplib";
import { User } from "src/users/entities/user.entity";

@Injectable()
export class OtpAuthenticationService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>, private readonly configService: ConfigService) {}

  async generateSecretAuthenticator(email: string) {
    const secretAuthenticator = authenticator.generateSecret();
    const appName = this.configService.getOrThrow("TFA_APP_NAME");
    const uri = authenticator.keyuri(email, appName, secretAuthenticator);

    return {
      uri,
      secretAuthenticator,
    };
  }

  verifyCode(code: string, secret: string) {
    return authenticator.verify({
      token: code,
      secret,
    });
  }

  async enableStatusTfaForUser(id: string, secret: string) {
    return await this.userModel.findByIdAndUpdate(id, { tfaSecret: secret, isTfaEnabled: true });
  }
}
