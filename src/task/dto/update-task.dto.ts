import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { User } from 'src/user/entities/user.entity';
import { CreateTaskDto } from './create-task.dto';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
    @ApiProperty() 
    @IsNotEmpty()
    codTask: number;
}
