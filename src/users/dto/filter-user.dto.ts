import { IsOptional, IsPositive, Min } from "class-validator";

export class FilterUsersDto {
  @IsOptional()
  @IsPositive()
  limit: number;

  @IsOptional()
  @Min(0)
  offset: number;

  @IsOptional()
  firstName: string;

  @IsOptional()
  lastName: string;
}
