import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { ApiTags } from "@nestjs/swagger";
import { FilterUsersDto } from "./dto/filter-user.dto";

@ApiTags("Users")
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post("create")
  async create(@Body() payload: CreateUserDto) {
    return await this.usersService.create(payload);
  }

  @Get("all")
  async findAll(@Query() params?: FilterUsersDto) {
    return await this.usersService.findAll(params);
  }

  @Get("one/:id")
  async findOne(@Param("id") id: string) {
    return await this.usersService.findOne(id);
  }

  @Patch("update/:id")
  update(@Param("id") id: string, @Body() payload: UpdateUserDto) {
    return this.usersService.update(id, payload);
  }

  /** Eliminacion logica de una coleccion */
  @Patch("delete/:id")
  async delete(@Param("id") id: string) {
    return await this.usersService.delete(id);
  }

  /** Eliminacion fiksica de una coleccion */
  @Delete("remove/:id")
  async remove(@Param("id") id: string) {
    return await this.usersService.remove(id);
  }
}
