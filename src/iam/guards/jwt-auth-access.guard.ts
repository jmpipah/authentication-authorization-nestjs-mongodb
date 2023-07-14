import { ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { IS_PUBLIC } from "../decorators/is-public.decorator";
import { API_KEY_IS_REQUIRED } from "src/api-key/decorators/api-key.decorator";
import { ApiKeyService } from "src/api-key/api-key.service";

@Injectable()
export class JwtAuthAccessGuard extends AuthGuard("jwt-access") {
  constructor(private reflector: Reflector, private readonly apiKeyService: ApiKeyService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<any> {
    const isPublic = this.reflector.get(IS_PUBLIC, context.getHandler());
    const apiKeyIsRequired = this.reflector.get(API_KEY_IS_REQUIRED, context.getHandler());

    if (isPublic) {
      return true;
    }

    /** Accedemos a los encabezados de la solicitud */
    const request = context.switchToHttp().getRequest();
    /** Obtenemos el Bearer apiKey */
    const bearerApiKey = request.headers.authorization;

    if (bearerApiKey) {
      const apiKey = bearerApiKey.split(" ")[1];
      if (apiKeyIsRequired) {
        const isValidApiKey = this.apiKeyService.validar(apiKey);
        if (isValidApiKey) {
          return true;
        }
      }
    }

    return super.canActivate(context);
  }
}
