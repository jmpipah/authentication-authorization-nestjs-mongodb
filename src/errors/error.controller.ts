import { Controller, Get, Post } from "@nestjs/common";
import { ErrorLoggerService } from "./error-logger.service";

@Controller("error-log")
export class ErrorLoggerController {
  constructor(private readonly errorLoggerService: ErrorLoggerService) {}

  @Get("all")
  getAllErrorLog() {
    const errorList = this.errorLoggerService.getAllErrorLog();
    return { errorList };
  }

  @Post("clear")
  clearAllErrorLog() {
    return this.errorLoggerService.clearErrorLog();
  }
}
