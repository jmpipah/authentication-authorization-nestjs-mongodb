import { Global, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { MongooseConfigService } from "./mongoose.service";

@Global()
@Module({ imports: [MongooseModule.forRootAsync({ useClass: MongooseConfigService })], exports: [MongooseModule] })
export class DatabaseModule {}
