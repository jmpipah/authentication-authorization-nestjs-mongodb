import { ExecutionContext, Injectable, CanActivate, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class MaxAttemptsGuard implements CanActivate {
  /** Cantitad de intentos de peticion */
  private readonly maxAttemps = 3;
  private readonly blockIncreaseInMinutes = 5;
  private resetTime: number | null = null;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    let attempts = request.session.attempts || 0;
    let blockDurationInMinutes = request.session.blockDurationInMinutes || 1;
    const currentTime: number = Date.now();

    if (this.resetTime && currentTime < this.resetTime) {
      // Si hay un tiempo de reinicio programado y aun no a pasado, bloqueamos el acceso
      throw new UnauthorizedException(`Se ha excedido el limite de intentos por favor vuelva en ${blockDurationInMinutes} minutos`);
    }

    if (this.resetTime && currentTime >= this.resetTime) {
      // Si ha pasado el tiempo de reinicio, restablecemos los intentos
      attempts = 0;
      this.resetTime = null;
    }

    if (attempts >= this.maxAttemps) {
      // Bloquear el acceso si se excede el numero de maximos intentos permitidos
      const blockTime = currentTime + blockDurationInMinutes * 60 * 1000; // convertirmos a minutos

      // Si aún estamos dentro del periodo de bloqueo, bloqueamos el acceso
      this.resetTime = blockTime;

      // Incrementamos le contador de intentos para el tiempo de bloqueo
      request.session.blockDurationInMinutes = blockDurationInMinutes * this.blockIncreaseInMinutes;

      throw new UnauthorizedException(`Se ha excedido el limite de intentos por favor vuelva en ${blockDurationInMinutes} minutos`);
    }

    // Incrementamops los intentos de inicio de sesion
    request.session.attempts = attempts + 1;

    // Pertmitir el acceso si no ha excedido el maximo de intentos
    return true;
  }
}
