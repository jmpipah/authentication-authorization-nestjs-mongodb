import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { isMongoId } from "class-validator";

@Injectable()
export class MongoIdPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (!isMongoId(value)) {
      throw new BadRequestException(`El ID: ${value} no existe`);
    }
    return value;
  }
}
