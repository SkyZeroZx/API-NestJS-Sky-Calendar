import { ApiProperty } from '@nestjs/swagger';
import {   IsArray, IsNotEmpty,   } from 'class-validator';
import { User } from 'src/user/entities/user.entity';

export class SendNotificacionDto {
  @ApiProperty()

  
  @IsArray()
  @IsNotEmpty()
  users: User[];

  @IsArray()
  @IsNotEmpty()
  taskToUser: any[];
}
