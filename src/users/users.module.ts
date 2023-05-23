import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { User } from "./entities/user.entity";
import { UserSchema } from "./entities/user.entity";
import { HashingService } from "src/providers/hashing/hashing.service";
import { BcryptService } from "src/providers/hashing/bcrypt.service";

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  controllers: [UsersController],
  /** provide: Aquí se especifica qué clase o identificador debe usarse como clave para identificar este proveedor. En este caso, se está utilizando el servicio HashingService como identificador.
   * useClass: Aquí se especifica la clase que se utilizará para resolver la instancia cuando se inyecte HashingService. En este caso, se está utilizando el servicio BcryptService como la implementación concreta que se utilizará.
   */
  providers: [{ provide: HashingService, useClass: BcryptService }, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
