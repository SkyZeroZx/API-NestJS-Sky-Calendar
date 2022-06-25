import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { UserRole } from '../enums/user-role.enum';

export class CreateUserDto {
  @ApiProperty()
  @MinLength(6)
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(80)
  nombre: string;

  @IsString()
  @MinLength(2)
  @MaxLength(120)
  @IsNotEmpty()
  apellidoMaterno: string;

  @IsString()
  @MinLength(2)
  @MaxLength(120)
  @IsNotEmpty()
  apellidoPaterno: string;

  @IsEnum(UserRole)
  @IsNotEmpty()
  role: string;
}
