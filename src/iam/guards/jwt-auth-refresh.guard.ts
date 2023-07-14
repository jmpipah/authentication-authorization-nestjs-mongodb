import { Injectable, ExecutionContext } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Reflector } from "@nestjs/core";
import { IS_PUBLIC } from "../decorators/is-public.decorator";

@Injectable()
export class JwtAuthRefreshGuard extends AuthGuard("jwt-refresh") {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canACtivate(context: ExecutionContext) {
    const isPublic = this.reflector.get(IS_PUBLIC, context.getHandler());

    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }
}
