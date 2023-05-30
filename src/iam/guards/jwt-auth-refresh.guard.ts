import { Injectable, ExecutionContext } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Reflector } from "@nestjs/core";

@Injectable()
export class JwtAuthRefreshGuard extends AuthGuard("jwt-refresh") {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canACtivate(context: ExecutionContext) {
    // TODO: Implementacion de rutas publicas

    return super.canActivate(context);
  }
}
