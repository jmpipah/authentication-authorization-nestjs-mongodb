import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { ApiTags } from "@nestjs/swagger";

import { MongoIdPipe } from "src/common/pipes/mongo-id.pipe";
import { CreateUserDto, FilterUsersDto, UpdateUserDto } from "./dto";
import { JwtAuthAccessGuard } from "src/iam/guards/jwt-auth-access.guard";

@ApiTags("Users")
@UseGuards(JwtAuthAccessGuard)
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
  async findOne(@Param("id", MongoIdPipe) id: string) {
    return await this.usersService.findOne(id);
  }

  @Patch("update/:id")
  update(@Param("id", MongoIdPipe) id: string, @Body() payload: UpdateUserDto) {
    return this.usersService.update(id, payload);
  }

  @Patch("delete/:id")
  async delete(@Param("id", MongoIdPipe) id: string) {
    return await this.usersService.delete(id);
  }

  @Delete("remove/:id")
  async remove(@Param("id", MongoIdPipe) id: string) {
    return await this.usersService.remove(id);
  }
}
