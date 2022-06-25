import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Constant } from 'src/common/constants/Constant';
import { NotificacionService } from 'src/notificacion/notificacion.service';
import { TaskToUserDto } from 'src/task_to_user/dto/task-to-user.dto';
import { TaskToUser } from 'src/task_to_user/entities/task_to_user.entity';
import { TaskToUserService } from 'src/task_to_user/task_to_user.service';
import { Type } from 'src/type/entities/type.entity';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { DeleteTaskDto } from './dto/delete-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,

    private readonly notificacionService: NotificacionService,

    private readonly serviceTaskToUser: TaskToUserService,
  ) {}

  /**
   * It creates a task and assigns it to a list of users
   * @param {CreateTaskDto} createTaskDto - CreateTaskDto
   * @returns an object with the following structure:
   * ```
   * {
   *   message: string;
   *   info?: string;
   *   task?: Task;
   * }
   * ```
   */
  async create(createTaskDto: CreateTaskDto) {
    let task: Task;
    this.logger.log('Creando Task');
    try {
      const newTask = this.taskRepository.create({
        title: createTaskDto.title,
        description: createTaskDto.description,
        start: createTaskDto.dateRange[0],
        end: createTaskDto.dateRange[1],
        codType: createTaskDto.codType,
      });
      task = await this.taskRepository.save(newTask);
    } catch (error) {
      this.logger.error(`Sucedio un error al crear el task`, { createTaskDto }, { error });
      return { message: 'Sucedio un error al crear el task' };
    }
    console.log('test createTaskDto.users)', createTaskDto.users);

    let arrayTaskToUser: any[] = [];
    for (let user of createTaskDto.users) {
      try {
        arrayTaskToUser.push(await this.serviceTaskToUser.saveTaskToUser(task.codTask, user.id));
      } catch (error) {
        this.logger.error(
          `Sucedio un error al registrar el usuario a la tarea ${task.codTask}`,
          { user },
          { error },
        );
        return { message: 'Sucedio un error al asignar la tarea al usuario' };
      }
    }
    console.log('ArrayToUser ', arrayTaskToUser);

    this.logger.log('Task registrado exitosamente');
    return {
      message: Constant.MENSAJE_OK,
      info: 'Task registrado exitosamente',
      taskToUser: arrayTaskToUser,
    };
  }



  /**
   * It returns a list of tasks with the following fields: id, title, description, start, end, startDate,
   * endDate, backgroundColor, borderColor, display and codType
   * @returns An array of objects with the following structure:
   * ```
   * [
   *   {
   *     id: 1,
   *     title: 'Task 1',
   *     description: 'Description 1',
   *     start: '2020-01-01T08:00:00',
   *     end: '2020-01-01T09:00:00',
   *     startDate: '2020
   */
  async findAll() {
    return await this.taskRepository
      .createQueryBuilder('TASK')
      .select('TASK.codTask', 'id')
      .addSelect('TASK.title', 'title')
      .addSelect('TASK.description', 'description')
      .addSelect('CONCAT (DATE_FORMAT(TASK.start,"%Y-%m-%d"),"T",TYPE.start )', 'start')
      .addSelect('CONCAT (DATE_FORMAT(TASK.end,"%Y-%m-%d"),"T" ,TYPE.end  )', 'end')
      .addSelect('DATE_FORMAT(TASK.start,"%Y-%m-%d")', 'startDate')
      .addSelect('DATE_FORMAT(TASK.end,"%Y-%m-%d")', 'endDate')
      .addSelect('TYPE.backgroundColor', 'backgroundColor')
      .addSelect('TYPE.borderColor', 'borderColor')
      .addSelect('TYPE.display', 'display')
      .addSelect('TYPE.codType', 'codType')
      .innerJoin(Type, 'TYPE', 'TYPE.codType = TASK.codType')
      .getRawMany();
  }

  /**
   * It returns a list of tasks with the following fields: id, title, description, start, end,
   * backgroundColor, borderColor, display
   * @param id - The id of the user
   * @returns An array of objects with the following structure:
   * ```
   * [
   *   {
   *     id: 1,
   *     title: 'Task 1',
   *     description: 'Description 1',
   *     start: '2020-01-01T08:00:00',
   *     end: '2020-01-01T09:00:00',
   *     backgroundColor: '#
   */
  async findByUser(id) {
    return await this.taskRepository
      .createQueryBuilder('TASK')
      .select('TASK.codTask', 'id')
      .addSelect('TASK.title', 'title')
      .addSelect('TASK.description', 'description')
      .addSelect('CONCAT (DATE_FORMAT(TASK.start,"%Y-%m-%d"),"T",TYPE.start )', 'start')
      .addSelect('CONCAT (DATE_FORMAT(TASK.end,"%Y-%m-%d"),"T" ,TYPE.end  )', 'end')
      .addSelect('TYPE.backgroundColor', 'backgroundColor')
      .addSelect('TYPE.borderColor', 'borderColor')
      .addSelect('TYPE.display', 'display')
      .innerJoin(Type, 'TYPE', 'TYPE.codType = TASK.codType')
      .innerJoin(TaskToUser, 'TASK_TO_USER', 'TASK_TO_USER.codTask = TASK.codTask')
      .innerJoin(User, 'USER', 'USER.id =TASK_TO_USER.codUser')
      .where('USER.id = :id', {
        id: id,
      })
      .getRawMany();
  }

  /**
   * It returns a list of users that are assigned to a task
   * @param {number} codTask - number
   * @returns An array of objects with the following structure:
   * [
   *   {
   *     id: 1,
   *     nombre: 'Juan',
   *     apellidoPaterno: 'Perez',
   *     apellidoMaterno: 'Gonzalez',
   *   },
   *   {
   *     id: 2,
   *     nombre: 'Pedro',
   */
  async findByTask(codTask: number) {
    return await this.taskRepository
      .createQueryBuilder('TASK')
      .select('USER.id', 'id')
      .addSelect('USER.nombre', 'nombre')
      .addSelect('USER.apellidoPaterno', 'apellidoPaterno')
      .addSelect('USER.apellidoMaterno', 'apellidoMaterno')
      .innerJoin(TaskToUser, 'TASK_TO_USER', 'TASK_TO_USER.codTask = TASK.codTask')
      .innerJoin(User, 'USER', 'USER.id =TASK_TO_USER.codUser')
      .where('TASK.codTask = :codTask', {
        codTask: codTask,
      })
      .getRawMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} task`;
  }

  async update(updateTaskDto: UpdateTaskDto) {
    this.logger.log(`Actualizando tarea`, updateTaskDto);
    // Obtenemos los tokens de los usuarios antes de eliminarlos los relacionado a la tarea
    const tokens = await this.notificacionService.findTokensByTask(updateTaskDto.codTask);
    try {
      const updateTask = await this.taskRepository
        .createQueryBuilder()
        .update(Task)
        .set({
          codType: updateTaskDto.codType,
          title: updateTaskDto.title,
          description: updateTaskDto.description,
          start: updateTaskDto.dateRange[0],
          end: updateTaskDto.dateRange[1],
        })
        .where('codTask = :codTask', { codTask: updateTaskDto.codTask })
        .execute();
      if (updateTask.affected > 0) {
        this.logger.log(`Se actualizo exitosamente el task`, { updateTaskDto });
        // Validando que se actualicen los task procedemos a enviar las notificaciones a los tokens
        for (let item of tokens) {
          this.notificacionService.sendNotification(
            item.tokenPush,
            Constant.NOTIFICACION_UPDATE_TASK,
          );
        }
        return {
          message: Constant.MENSAJE_OK,
          info: 'Task Actualizado Correctamente',
        };
      }
    } catch (error) {
      console.log('El error es ', error);
      this.logger.error(`Sucedio un error al actualizar al task ${updateTaskDto.codTask}`, error);
      return { message: 'Sucedio un error al actualizar al task' };
    }
  }

  /**
   * It deletes a task from the database
   * @param {DeleteTaskDto} deleteTaskDto - DeleteTaskDto
   * @returns {
   *     message: string
   *   }
   */
  async removeTask(deleteTaskDto: DeleteTaskDto) {
    this.logger.log(`Eliminando tarea`, deleteTaskDto);
    // Obtenemos los tokens de los usuarios antes de eliminarlos los relacionado a la tarea
    const tokens = await this.notificacionService.findTokensByTask(deleteTaskDto.codTask);
    try {
      const taskDelete = await this.taskRepository
        .createQueryBuilder()
        .delete()
        .from(Task)
        .where('codTask = :codTask', { codTask: deleteTaskDto.codTask })
        .execute();
      if (taskDelete.affected > 0) {
        this.logger.log(`Tarea eliminada exitosamente`);
        // Validando que se eliminen los task procedemos a enviar las notificaciones a los tokens
        for (let item of tokens) {
          this.notificacionService.sendNotification(
            item.tokenPush,
            Constant.NOTIFICACION_DELETE_TASK,
          );
        }
        return { message: Constant.MENSAJE_OK, info: 'Tarea eliminada exitosamente' };
      } else {
        this.logger.warn(`No se encontro tarea a eliminar`);
        return { message: 'Sucedio un error', info: 'No se encontro tarea a eliminar' };
      }
    } catch (error) {
      this.logger.error(`Error al elimanar la tarea`, deleteTaskDto, error);
      return { message: 'Sucedio un error al eliminar la tarea' };
    }
  }

  async removeUserToTask(taskToUserDto: TaskToUserDto) {
    return await this.serviceTaskToUser.removeUserToTask(taskToUserDto);
  }

  async addUserToTask(taskToUserDto: TaskToUserDto) {
    return await this.serviceTaskToUser.addUserToTask(taskToUserDto);
  }
}