import { BadRequestException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { ErrorLoggerService } from "./error-logger.service";

@Injectable()
export class ErrorService {
  constructor(private readonly errorLoggerService: ErrorLoggerService) {}
  createError(error: any) {
    /** Registramos el error en nuestro log */
    this.errorLoggerService.createErrorLog("Error capturado en el catch", error);

    /** Mensaje personalizado cuando existe un registro duplicado */
    if (error.name === "MongoServerError" && error.code === 11000) {
      throw new BadRequestException(`El ${Object.keys(error.keyValue)} ya existe`);
    } else {
      /** Mensaje de error por defecto */
      throw new InternalServerErrorException(error.message);
    }
  }
}
