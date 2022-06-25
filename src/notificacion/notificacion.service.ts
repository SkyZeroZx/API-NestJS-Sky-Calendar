import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Constant } from 'src/common/constants/Constant';
import { TaskToUser } from 'src/task_to_user/entities/task_to_user.entity';
import { TaskToUserService } from 'src/task_to_user/task_to_user.service';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateNotificacionDto } from './dto/create-notificacion.dto';
import { UpdateNotificacionDto } from './dto/update-notificacion.dto';
import { Notificacion } from './entities/notificacion.entity';
const webpush = require('web-push');

@Injectable()
export class NotificacionService {
  private readonly logger = new Logger(NotificacionService.name);
  constructor(
    @InjectRepository(Notificacion)
    private readonly notificacionRepository: Repository<Notificacion>,
    private readonly taskToUserService: TaskToUserService,
  ) {}

  async suscribeNotification(codUser: number, createNotificacionDto: CreateNotificacionDto) {
    this.logger.log('Suscribiendo Token Task To User', createNotificacionDto);
    try {
      let listaTaskToUser = await this.taskToUserService.TaskToUserByUser(codUser);
      for (let taskToUser of listaTaskToUser) {
        // Validamos si existe alguna coincidencia
        const notificactionRegister = await this.notificacionRepository.findAndCount({
          where: {
            codTaskToUser: taskToUser.id,
            tokenPush: createNotificacionDto.tokenPush,
          },
        });
        // En caso no devuelva 0 significa que no existe por lo cual vamos a registrarlo
        if (notificactionRegister[1] == 0) {
          await this.notificacionRepository.save({
            codTaskToUser: taskToUser.id,
            tokenPush: createNotificacionDto.tokenPush,
          });
        }
      }
    } catch (error) {
      this.logger.error(`Sucedio un error al guardar el token`, error);
      return { message: 'Sucedio un error al guardar el token' };
    }

    this.logger.log('Se guardo el Token Task To User');
    return { message: Constant.MENSAJE_OK, info: 'Se guardo el token exitosamente' };
  }

  async save(tokenPush: string, codTaskToUser: number) {
    this.logger.log(`Guardando Token Task To User ${codTaskToUser}`);
    return await this.notificacionRepository.save({
      codTaskToUser: codTaskToUser,
      tokenPush: tokenPush,
    });
  }

  async sendNotification(tokenPush: string, message: Object) {
    console.log('Envio Notificacion al token  el valor es', tokenPush);
    webpush
      .sendNotification(JSON.parse(tokenPush), JSON.stringify(message))
      .then((res) => {
        console.log('Enviado !!', res);
      })
      .catch((err) => {
        console.log('Fallo Enviar StatusCode: ' + err.statusCode, err.body);
      });
  }

  async findTokensByUser(codUser) {
    return await this.notificacionRepository
      .createQueryBuilder('NOTIFICACION')
      .select('DISTINCT   (NOTIFICACION.tokenPush)', 'tokenPush')
      .innerJoin(TaskToUser, 'TASK_TO_USER', ' TASK_TO_USER.id = NOTIFICACION.codTaskToUser')
      .where('TASK_TO_USER.codUser = :codUser', {
        codUser: codUser,
      })
      .getRawMany();
  }

  async findTokensByTask(codTask) {
    return await this.notificacionRepository
      .createQueryBuilder('NOTIFICACION')
      .select('DISTINCT   (NOTIFICACION.tokenPush)', 'tokenPush')
      .innerJoin(TaskToUser, 'TASK_TO_USER', ' TASK_TO_USER.id = NOTIFICACION.codTaskToUser')
      .where('TASK_TO_USER.codTask = :codTask', {
        codTask: codTask,
      })
      .getRawMany();
  }

  async registerTaskTokenByUser(listaUsers: User[], arrayTaskToUser: any[]) {
    this.logger.log('Registrando Tokens para la nueva tarea creada');
    let arrayTokenUsers: any[] = [];
    try {
      for (let user of listaUsers) {
        try {
          arrayTokenUsers.push(await this.findTokensByUser(user.id));
        } catch (error) {
          this.logger.error('Error al obtener token del usuario', error);
          console.log('Error al obtener token del usuario' + error);
          return {
            message: 'Error al obtener token del usuario',
          };
        }
      }
      console.log('Despues del Lop soy el arrayTokens cantidad', arrayTokenUsers.length);
      // Ahora con el array de Tokens lo iteramos
      for (let i = 0; i < arrayTokenUsers.length; i++) {
        for (let j = 0; j < arrayTokenUsers[i].length; j++) {
          console.log(
            `Voy a registrar el token con CODIGO TASK TO USER y token ${arrayTokenUsers[i][j].tokenPush}`,
            arrayTaskToUser[i].id,
          );
          await this.save(
            arrayTokenUsers[i][j].tokenPush,
            arrayTaskToUser[i].id,
          );
          this.sendNotification(
            arrayTokenUsers[i][j].tokenPush,
            Constant.NOTIFICACION_NEW_TASK,
          );
        }
      }
      this.logger.log('Notificaciones enviadas exitosamente');
      return {
        message: Constant.MENSAJE_OK,
        info: 'Notificaciones enviadas exitosamente',
      };
    } catch (error) {
      this.logger.error('Sucedio un error al registrar tokens para la nueva tarea', error);
      return {
        message: 'Sucedio un error al registrar tokens para la nueva tarea',
      };
    }
  }













  findAll() {
    return `This action returns all notificacion`;
  }

  findOne(id: number) {
    return `This action returns a #${id} notificacion`;
  }

  update(id: number, updateNotificacionDto: UpdateNotificacionDto) {
    return `This action updates a #${id} notificacion`;
  }

  remove(id: number) {
    return `This action removes a #${id} notificacion`;
  }
}
