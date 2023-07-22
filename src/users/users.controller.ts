import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, SetMetadata } from "@nestjs/common";
import { UsersService } from "./users.service";
import { ApiTags } from "@nestjs/swagger";

import { MongoIdPipe } from "src/common/pipes/mongo-id.pipe";
import { CreateUserDto, FilterUsersDto, UpdateUserDto } from "./dto";
import { JwtAuthAccessGuard } from "src/iam/guards/jwt-auth-access.guard";
import { IsPublic } from "src/iam/decorators/is-public.decorator";
import { ApiKeyIsRequired } from "src/api-key/decorators/api-key.decorator";

@ApiTags("Users")
@UseGuards(JwtAuthAccessGuard)
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post("create")
  async create(@Body() payload: CreateUserDto) {
    return await this.usersService.create(payload);
  }

  // @IsPublic()
  //@ApiKeyIsRequired()
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
