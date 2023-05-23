import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "./entities/user.entity";
import { FilterQuery, Model } from "mongoose";
import { FilterUsersDto } from "./dto/filter-user.dto";

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}
  async create(payload: CreateUserDto) {
    try {
      const newRecord = new this.userModel(payload);
      return await newRecord.save();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll(params?: FilterUsersDto) {
    try {
      const filters: FilterQuery<User> = { isDeleted: false };
      const { limit, offset, firstName, lastName } = params;

      if (params) {
        if (firstName) {
          filters.firstName = {
            $regex: firstName,
            $options: "i",
          };
        }
        if (lastName) {
          filters.lastName = {
            $regex: lastName,
            $options: "i",
          };
        }
      }

      const [records, totalDocuments] = await Promise.all([
        this.userModel
          .find(filters)
          .limit(limit)
          .skip(offset || 0 * limit || 0)
          .exec(),
        this.userModel.countDocuments(filters).exec(),
      ]);

      return {
        records,
        totalDocuments,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findOne(id: string): Promise<User> {
    try {
      /** Buscamos la coleccion por el ID */
      const record = await this.userModel.findById(id.trim()).exec();

      /** Preguntamos si la coleccion no esta eliminada (logico) */
      if (record.isDeleted) {
        throw new NotFoundException("Registro no encontrado");
      }

      /** Si la coleccion no existe */
      if (!record) {
        throw new NotFoundException("Registro no encontrado");
      }

      return record;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async update(id: string, payload: UpdateUserDto) {
    try {
      const record = await this.findOne(id);

      return await this.userModel.findByIdAndUpdate(record.id, { $set: payload }, { new: true, runValidators: true }).exec();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async delete(id: string) {
    const record = await this.findOne(id);

    return await this.userModel.findByIdAndUpdate(record.id, { $set: { isDeleted: !record.isDeleted } }, { new: true, runValidators: true }).exec();
  }

  async remove(id: string) {
    const record = await this.findOne(id);
    return await this.userModel.findByIdAndRemove(id).exec();
  }
}
