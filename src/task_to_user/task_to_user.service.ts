import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Constant } from 'src/common/constants/Constant';
import { Repository } from 'typeorm';
import { TaskToUserDto } from './dto/task-to-user.dto';
import { TaskToUser } from './entities/task_to_user.entity';

@Injectable()
export class TaskToUserService {
  private readonly logger = new Logger(TaskToUserService.name);
  constructor(
    @InjectRepository(TaskToUser)
    private readonly taskToUserRepository: Repository<TaskToUser>,
  ) {}

  /**
   * It adds a user to a task
   * @param {TaskToUserDto} taskToUserDto - TaskToUserDto
   * @returns {
   *     message: Constant.MENSAJE_OK,
   *     info: 'Usuario Agregado a la Tarea',
   *   };
   */
  async addUserToTask(taskToUserDto: TaskToUserDto) {
    try {
      await this.taskToUserRepository.save({ codTask: taskToUserDto.codTask, codUser: taskToUserDto.codUser });
    } catch (error) {
      this.logger.error(`Sucedio un error al agregar al usuario ${taskToUserDto.codUser} a la tarea ${taskToUserDto.codTask}`, {
        error,
      });
      return { message: 'Sucedio un error al agregar al usuario a la tarea seleccionada' };
    }
    // TODO ADD USER TOKEN FOR THE TASK
    this.logger.log(`Se agrego exitosamente al usuario ${taskToUserDto.codUser} a la tarea ${taskToUserDto.codTask}`);
    return {
      message: Constant.MENSAJE_OK,
      info: 'Usuario Agregado a la Tarea',
    };
  }

/**
 * It saves a task to a user
 * @param codTask - The task code
 * @param codUser - The user's ID
 * @returns The taskToUserRepository.save() method is being returned.
 */
  async saveTaskToUser(codTask, codUser) {
    return await this.taskToUserRepository.save({ codTask: codTask, codUser: codUser });
  }

  /**
   * It deletes a user from a task
   * @param {TaskToUserDto} taskToUserDto - TaskToUserDto
   * @returns a message and a status code.
   */
  async removeUserToTask(taskToUserDto: TaskToUserDto) {
    try {
      await this.taskToUserRepository.delete({ codUser: taskToUserDto.codUser, codTask: taskToUserDto.codTask });
    } catch (error) {
      this.logger.error(`Sucedio un error al eliminar al usuario ${taskToUserDto.codUser} de la tarea ${taskToUserDto.codTask}`, {
        error,
      });
      return { message: 'Sucedio un error al eliminar al usuario de la tarea seleccionada' };
    }
    // TODO REMOVE USER TOKEN FOR THE TASK

    this.logger.log(`Se elimino exitosamente al usuario ${taskToUserDto.codUser} de la tarea ${taskToUserDto.codTask}`);
    return {
      message: Constant.MENSAJE_OK,
      info: 'Usuario Eliminado de la Tarea',
    };
  }

  /**
   * It returns the id of the taskToUser table where the codUser is equal to the id passed as a parameter
   * @param {number} id - number
   * @returns An array of objects with the id of the taskToUser
   */
  async TaskToUserByUser(id: number) {
    return await this.taskToUserRepository
      .createQueryBuilder()
      .select('id')
      .where('codUser =:codUser', {
        codUser: id,
      })
      .getRawMany();
  }
}
