import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { SignInDto } from "./dto/signin-auth.dto";
import { ErrorService } from "src/errors/error.service";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "src/users/entities/user.entity";
import { Model } from "mongoose";
import { HashingService } from "src/providers/hashing/hashing.service";
import { PayloadToken } from "../models/token.model";
import { JwtService } from "@nestjs/jwt";
import config from "src/config";
import { ConfigType } from "@nestjs/config";

@Injectable()
export class AuthenticationCommonService {
  constructor(
    @Inject(config.KEY) private readonly configSerivce: ConfigType<typeof config>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly errorService: ErrorService,
    private readonly hashinService: HashingService,
    private readonly jwtService: JwtService,
  ) {}

  generateJwtAccessToken(payload: PayloadToken) {
    try {
      const accessToken = this.jwtService.signAsync(payload, {
        secret: this.configSerivce.session.jwtAccessTokenSecret,
        expiresIn: this.configSerivce.session.jwtAccessTokenExpiresTime,
      });

      return accessToken;
    } catch (error) {
      this.errorService.createError(error);
    }
  }

  generateJwtRefreshoken(payload: PayloadToken) {
    try {
      const refreshToken = this.jwtService.signAsync(payload, {
        secret: this.configSerivce.session.jwtRefreshTokenSecret,
        expiresIn: this.configSerivce.session.jwtRefreshTokenExpiresTime,
      });

      return refreshToken;
    } catch (error) {
      this.errorService.createError(error);
    }
  }

  /** Login de usuario, usado en el local strategy */
  async findUserToAuthenticate(payload: SignInDto) {
    try {
      /** Buscamos los datos del usuario */
      const user = await this.userModel.findOne({ email: payload.email.trim() }).exec();

      /** Si el usuario no existe enviamos una excepcion */
      if (!user) {
        throw new BadRequestException("Por favor ingrese un email y/o contraseña válida");
      }

      /** Confirmoamos que la contraseña sea la correcta */
      const isPasswordMatched = await this.hashinService.compare(payload.password.trim(), user.password);

      if (!isPasswordMatched) {
        throw new BadRequestException("Por favor ingrese un email y/o contraseña válida");
      }

      return user;
    } catch (error) {
      this.errorService.createError(error);
    }
  }

  /** Buscar usuario logueado */
  async findUserAutenticated(id: string) {
    try {
      return await this.userModel.findById(id);
    } catch (error) {
      this.errorService.createError(error);
    }
  }
}
