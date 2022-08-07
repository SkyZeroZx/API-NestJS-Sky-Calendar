import { Controller, Get, Post, Body, Patch, Delete, Logger, UseGuards } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ApiTags } from '@nestjs/swagger';
import { Constant } from '../common/constants/Constant';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserDecorator as User } from '../common/decorators/user.decorator';
import { User as UserEntity } from '../user/entities/user.entity';
import { DeleteTaskDto } from './dto/delete-task.dto';
import { TaskToUserDto } from '../task_to_user/dto/task-to-user.dto';

@ApiTags('Task')
@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}
  private readonly logger = new Logger(TaskController.name);

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createTaskDto: CreateTaskDto) {
    return this.taskService.create(createTaskDto);
  }

  /*Este es un método que devolverá todas las tareas*/
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll() {
    this.logger.log('Listando Taks');
    const taks = await this.taskService.findAll();
    if (taks.length === 0) {
      this.logger.warn('No se encontraron taks');
      return { message: 'No se encontraron task' };
    }
    this.logger.log('Listado Task ' + Constant.MENSAJE_OK);
    return taks;
  }

  /* Este es un método que devolverá todas las tareas asignadas al usuario que ha iniciado sesión. */
  @UseGuards(JwtAuthGuard)
  @Get('/user')
  async getTaskByUser(@User() user: UserEntity) {
    this.logger.log(`Listando Task por usuario ${user.username}`);
    const taskByUser = await this.taskService.findByUser(user.id);
    if (taskByUser.length === 0) {
      this.logger.warn(`No se encontraron taks para el usuario ${user.username}`);
      return { message: 'No se encontraron task' };
    }
    this.logger.log(`Listado Task para el usuario ${user.username} ${Constant.MENSAJE_OK}`);
    return taskByUser;
  }

  /* Este es un método que devolverá todos los usuarios asignados a la tarea. */
  @UseGuards(JwtAuthGuard)
  @Post('/task_user')
  async getUsersByTask(@Body() data: any) {
    this.logger.log(`Listando usuarios por task`);
    const taskByUser = await this.taskService.findByTask(parseInt(data.id));
    if (taskByUser.length === 0) {
      this.logger.warn(`No se encontraron users para el task ${data.id}`);
      return { message: 'No se encontraron users para el task' };
    }
    this.logger.log(`Listado Users para el task ${data.id} ${Constant.MENSAJE_OK}`);
    return taskByUser;
  }

  /* This is a method that will delete the user from the task. */
  @UseGuards(JwtAuthGuard)
  @Delete()
  removeUserToTask(@Body() taskToUserDto: TaskToUserDto) {
    return this.taskService.removeUserToTask(taskToUserDto);
  }

  /* This is a method that will add the user to the task. */
  @UseGuards(JwtAuthGuard)
  @Post('/add_user')
  addUserToTask(@Body() taskToUserDto: TaskToUserDto) {
    return this.taskService.addUserToTask(taskToUserDto);
  }

  /* This is a method that will update the task. */
  @UseGuards(JwtAuthGuard)
  @Patch()
  async update(@Body() updateTaskDto: UpdateTaskDto) {
    return this.taskService.update(updateTaskDto);
  }

  /* This is a method that will delete the task. */
  @UseGuards(JwtAuthGuard)
  @Delete('/remove_task')
  removeTask(@Body() deleteTaskDto: DeleteTaskDto) {
    return this.taskService.removeTask(deleteTaskDto);
  }

  // @Post('/testTask')
  // @Auth('SuperAdminTesting')
  // testTaskRole() {
  //   return { message: 'OK' };
  // }
}
