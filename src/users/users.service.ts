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
      let filters: FilterQuery<User> = {};
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
      const record = await this.userModel.findById(id.trim()).exec();
      if (!record) {
        throw new NotFoundException("Registro no encontrado");
      }
      return record;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  delete(id: number) {
    return `This action removes a #${id} user`;
  }
}
