import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as session from "express-session";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix("api-authc-authz");

  /** Control de validacion de los Pipes (DTO) */
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  /** Inicializamos sesiones para controlar las peticiones al backend */
  app.use(
    session({
      secret: process.env.SECRET_SESSION,
      resave: false,
      saveUninitialized: true,
    }),
  );

  /** Configuracion para la documentacion con Swagger */
  const config = new DocumentBuilder()
    .setTitle("APIREST AUTHC Y AUTHZ")
    .setDescription("Autenticación y Autorización con NestJS y MongoDB")
    .setVersion("1.0")
    .addTag("Auth", "Endpoints relacionados con la autenticación Auth")
    .addTag("Users", "Endpoints relacionados con la autenticación User")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("docs", app, document);

  app.enableCors();

  await app.listen(4000);
}
bootstrap();
