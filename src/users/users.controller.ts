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

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(":id")
  delete(@Param("id") id: string) {
    return this.usersService.delete(+id);
  }
}
