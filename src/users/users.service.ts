import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "./entities/user.entity";
import { FilterQuery, Model } from "mongoose";
import { FilterUsersDto } from "./dto/filter-user.dto";
import { HashingService } from "../providers/hashing/hashing.service";
import { ErrorService } from "../errors/error.service";
import { ApiKeyService } from "../api-key/api-key.service";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly hashingService: HashingService,
    private readonly errorService: ErrorService,
    private readonly apiKeyService: ApiKeyService,
  ) {}
  /** Creamos un registro */
  async create(payload: CreateUserDto) {
    try {
      /** Hasheamos la contraseña */
      payload.password = await this.hashingService.hash(payload.password.trim());
      const newRecord = new this.userModel(payload);
      const hashedKey = await this.apiKeyService.createAndHash(newRecord.id);

      const record = await newRecord.save();

      return {
        ...record.toObject(),
        apiKey: hashedKey,
      };
    } catch (error) {
      /** Creamos el error personalizado */
      this.errorService.createError(error);
    }
  }

  /** Mostramos todos los registros, tambien aplicamos filtros opcionales */
  async findAll(params?: FilterUsersDto) {
    try {
      /** Establecemos un filtro por defecto */
      const filters: FilterQuery<User> = { isDeleted: false };
      const { limit, offset, firstName, lastName } = params;

      /** Si existen parámetros entonces aplicamos filtros de búsqueda */
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

      /** Procesamos ambas promesas al mismo tiempo, todos los registros y cantidad de registros */
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
      /** Creamos el error personalizado */
      this.errorService.createError(error);
    }
  }

  /** Busqueda de un registro por el ID */
  async findOne(id: string): Promise<User> {
    try {
      /** Buscamos el registro por el ID */
      const record = await this.userModel.findById(id.trim()).exec();

      /** Si el registro no existe */
      if (!record) {
        throw new NotFoundException("Registro no encontrado");
      }

      /** Preguntamos si el registro no esta eliminado (lógico) */
      if (record.isDeleted) {
        throw new NotFoundException("Registro no encontrado");
      }

      return record;
    } catch (error) {
      /** Creamos el error personalizado */
      this.errorService.createError(error);
    }
  }

  /** Actualizamos el registro por el ID */
  async update(id: string, payload: UpdateUserDto) {
    try {
      const record = await this.findOne(id);
      /** Hasheamos la contraseña */
      if (payload.password) {
        payload.password = await this.hashingService.hash(payload.password.trim());
      }
      return await this.userModel.findByIdAndUpdate(record.id, { $set: payload }, { new: true, runValidators: true }).exec();
    } catch (error) {
      /** Creamos el error personalizado */
      this.errorService.createError(error);
    }
  }

  /** Eliminacion lógica de un registro */
  async delete(id: string) {
    try {
      const record = await this.findOne(id);

      return await this.userModel.findByIdAndUpdate(record.id, { $set: { isDeleted: !record.isDeleted } }, { new: true, runValidators: true }).exec();
    } catch (error) {
      /** Creamos el error personalizado */
      this.errorService.createError(error);
    }
  }

  /** Eliminacion física de un registro */
  async remove(id: string) {
    try {
      await this.findOne(id);
      return await this.userModel.findByIdAndRemove(id).exec();
    } catch (error) {
      /** Creamos el error personalizado */
      this.errorService.createError(error);
    }
  }
}
