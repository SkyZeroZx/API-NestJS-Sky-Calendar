import { Controller, Get, Post, Body, Patch, Delete, Logger, UseGuards } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Constant } from '../common/constants/Constant';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserDecorator as User } from '../common/decorators/user.decorator';
import { User as UserEntity } from '../user/entities/user.entity';
import { DeleteTaskDto } from './dto/delete-task.dto';
import { TaskToUserDto } from '../task_to_user/dto/task-to-user.dto';
import { Auth } from '../common/decorators/auth.decorator';
import { TaskResponse } from '../common/swagger/response/task.response';

@ApiTags('Task')
@ApiBearerAuth()
@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}
  private readonly logger = new Logger(TaskController.name);

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Crea una nueva tarea' })
  @ApiResponse(TaskResponse.genericReponse)
  @Post()
  async create(@Body() createTaskDto: CreateTaskDto) {
    return this.taskService.create(createTaskDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Devuelve todas las tareas' })
  @ApiResponse(TaskResponse.responseFindAll)
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

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Devuelve todas las tareas solo del usuario logeado' })
  @ApiResponse(TaskResponse.getTaskByUser)
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

  @UseGuards(JwtAuthGuard)
  @Post('/task_user')
  @ApiOperation({ summary: 'Devuelve todos los usuarios asignado a una tarea' })
  @ApiBody(TaskResponse.bodyGetTaskByUser)
  @ApiResponse(TaskResponse.getUserByTask)
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

  @Auth('admin')
  @Delete()
  @ApiOperation({ summary: 'Eliminar un usuario de una tarea' })
  @ApiResponse(TaskResponse.genericReponse)
  removeUserToTask(@Body() taskToUserDto: TaskToUserDto) {
    return this.taskService.removeUserToTask(taskToUserDto);
  }

  @Auth('admin')
  @Post('/add_user')
  @ApiOperation({ summary: 'Agregar un usuario a una tarea' })
  @ApiResponse(TaskResponse.genericReponse)
  addUserToTask(@Body() taskToUserDto: TaskToUserDto) {
    return this.taskService.addUserToTask(taskToUserDto);
  }

  @Auth('admin')
  @Patch()
  @ApiOperation({ summary: 'Actualizar una tarea , descripcion , fecha inicio - fin' })
  @ApiResponse(TaskResponse.genericReponse)
  async update(@Body() updateTaskDto: UpdateTaskDto) {
    return this.taskService.update(updateTaskDto);
  }

  @Auth('admin')
  @Delete('/remove_task')
  @ApiOperation({
    summary: 'Eliminar una tarea asi los usuarios relacionados a esta misma en casacada',
  })
  @ApiResponse(TaskResponse.genericReponse)
  removeTask(@Body() deleteTaskDto: DeleteTaskDto) {
    return this.taskService.removeTask(deleteTaskDto);
  }
}
