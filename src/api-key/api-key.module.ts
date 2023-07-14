import { Module } from "@nestjs/common";
import { ApiKeyService } from "./api-key.service";
import { MongooseModule } from "@nestjs/mongoose";
import { ApiKey, ApiKeySchema } from "./entities/api-key.entity";
import { HashingService } from "src/providers/hashing/hashing.service";
import { BcryptService } from "src/providers/hashing/bcrypt.service";

@Module({
  imports: [MongooseModule.forFeature([{ name: ApiKey.name, schema: ApiKeySchema }])],
  providers: [{ provide: HashingService, useClass: BcryptService }, ApiKeyService],
  exports: [ApiKeyService],
})
export class ApiKeyModule {}
