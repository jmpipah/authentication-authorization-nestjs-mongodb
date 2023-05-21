import { Injectable } from "@nestjs/common";
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
    } catch (error) {}
  }

  async findAll(params?: FilterUsersDto) {
    try {
      let filters: FilterQuery<User> = {};
      const { limit, offset, firstName, lastName } = params;
      if (params) {
        if (firstName) {
          filters = {
            firstName: {
              $regex: firstName,
              $options: "i",
            },
            ...filters,
          };
        }
        if (lastName) {
          filters = {
            lastName: {
              $regex: lastName,
              $options: "i",
            },
            ...filters,
          };
        }
      }

      const records = await this.userModel
        .find(filters)
        .limit(limit)
        .skip(offset * limit)
        .exec();

      const totalDocuments = await this.userModel.countDocuments(filters).exec();

      return {
        records,
        totalDocuments,
      };
    } catch (error) {}
    return await this.userModel.find().exec();
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  delete(id: number) {
    return `This action removes a #${id} user`;
  }
}
