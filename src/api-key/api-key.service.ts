import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { ApiKey } from "./entities/api-key.entity";
import { Model } from "mongoose";
import { HashingService } from "src/providers/hashing/hashing.service";

@Injectable()
export class ApiKeyService {
  constructor(@InjectModel(ApiKey.name) private readonly apiKeyModel: Model<ApiKey>, private readonly hashingService: HashingService) {}

  async createAndHash(userId: string): Promise<string> {
    const hashedKey = await this.hashingService.hash(userId);

    const newRecord = new this.apiKeyModel({ ApiKey: hashedKey, user: userId });

    await newRecord.save();

    return hashedKey;
  }

  async validar(apiKey: string): Promise<boolean> {
    /** Buscamos el APÍKEY */
    const record = await this.apiKeyModel.findOne({ apiKey }).exec();

    if (record) {
      return true;
    } else {
      return false;
    }
  }
}
