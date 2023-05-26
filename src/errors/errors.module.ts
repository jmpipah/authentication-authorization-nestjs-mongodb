import { Module } from "@nestjs/common";
import { ErrorService } from "./error.service";
import { ErrorLoggerService } from "./error-logger.service";
import { ErrorLoggerController } from "./error.controller";

@Module({
  controllers: [ErrorLoggerController],
  providers: [ErrorService, ErrorLoggerService],
  exports: [ErrorService, ErrorLoggerService],
})
export class ErrorsModule {}
