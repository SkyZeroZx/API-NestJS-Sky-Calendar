import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Notificacion } from 'src/notificacion/entities/notificacion.entity';
import { TaskToUserModule } from 'src/task_to_user/task_to_user.module';
import { NotificacionModule } from 'src/notificacion/notificacion.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task]),
    TaskToUserModule,
    NotificacionModule
  ],
  controllers: [TaskController],
  providers: [TaskService],
  exports: [TaskService],
})
export class TaskModule {}
