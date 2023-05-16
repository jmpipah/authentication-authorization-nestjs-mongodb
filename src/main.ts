import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("api-authc-authz");
  app.enableCors();
  await app.listen(4000);
}
bootstrap();
