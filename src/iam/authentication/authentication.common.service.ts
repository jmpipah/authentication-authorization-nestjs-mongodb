import { BadRequestException, Injectable } from "@nestjs/common";
import { SignInDto } from "./dto/signin-auth.dto";
import { ErrorService } from "src/errors/error.service";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "src/users/entities/user.entity";
import { Model } from "mongoose";
import { HashingService } from "src/providers/hashing/hashing.service";

@Injectable()
export class AuthenticationCommonService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>, private readonly errorService: ErrorService, private readonly hashinService: HashingService) {}
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
}
