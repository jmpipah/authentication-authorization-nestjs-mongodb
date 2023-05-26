import { HttpStatus, Injectable } from "@nestjs/common";
import * as winston from "winston";
import * as fs from "fs";

@Injectable()
export class ErrorLoggerService {
  /** Utlizamos la clase Logger para registrar los errores */
  private logger: winston.Logger;

  constructor() {
    /** Configuracmos nuestra instancia de Logger con winston */
    this.logger = winston.createLogger({
      level: "error", // Nivel de registro
      format: winston.format.combine(winston.format.timestamp(), winston.format.json()), // Combinar formatos (para guardar la fecha del error en formato JSON)
      transports: [new winston.transports.File({ filename: "logs/error.log" })], // Archivo de registro donde se guardaran los errores
    });
  }

  /** El metodo createErrorLog acepta un mensaje y una traza (opcional) y utilizamos logger.error para guardar el error en el log */
  createErrorLog(message: string, trace?: any | string) {
    /** Registramos el error en el archivo de registro */
    this.logger.error(message, trace);
  }

  /** Listamos todos los errores generados en nuestro log */
  getAllErrorLog(): string[] {
    try {
      const errorLogContent = fs.readFileSync("logs/error.log", "utf-8");
      const errorLogLines = errorLogContent.split("\n");

      const jsonObjectArray = errorLogLines
        .filter((jsonString) => jsonString.trim() !== "") // filtramos cadenas vacias
        .map((jsonString) => JSON.parse(jsonString.replace(/\r/g, ""))); // Reemplazamos /r por cadena vacía

      return jsonObjectArray;
    } catch (error) {
      this.createErrorLog("No se pudo acceder al archivo error.log", HttpStatus.REQUEST_TIMEOUT);
    }
  }

  /** Limpiar todos los errores del archivo error.log */
  clearErrorLog() {
    const filePath = "logs/error.log";
    try {
      /** Abrimos el archivo en modo escritura para borrar su contenido */
      fs.writeFileSync(filePath, "");

      return { messge: "el contenido se elimino correctamente" };
    } catch (error) {
      /** Indicamos que hubio un error al eliminar el contenido */
      this.createErrorLog("error al borrar el contecnido del archivo de registro de errores", HttpStatus.REQUEST_TIMEOUT);
      return;
    }
  }
}
