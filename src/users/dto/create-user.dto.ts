import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, IsNotEmpty, Matches, MinLength, MaxLength } from "class-validator";

export class CreateUserDto {
  @IsNotEmpty({ message: "El email es requerido" })
  @IsEmail({}, { message: "Este campo debe ser un email válido" })
  @ApiProperty()
  readonly email: string;

  @IsString({ message: "La contraseña debe contener caractéres válidos" })
  @MinLength(6)
  @MaxLength(12)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: "La contraseña debe tener letras mayúsculas, minúsculas y números",
  })
  @ApiProperty()
  password: string;

  @IsString()
  @IsNotEmpty({ message: "Los nombres son requeridos" })
  @ApiProperty()
  firstName: string;

  @IsString()
  @IsNotEmpty({ message: "Los apellidos son requeridos" })
  @ApiProperty()
  lastName: string;
}
