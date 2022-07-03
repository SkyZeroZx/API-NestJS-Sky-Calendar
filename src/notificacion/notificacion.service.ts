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
    this.logger.log('Suscribiendo el token para el usuario', createNotificacionDto);
    try {
      // Validamos si existe alguna coincidencia
      const notificactionRegister = await this.notificacionRepository.findAndCount({
        where: {
          codUser: codUser,
          tokenPush: createNotificacionDto.tokenPush,
        },
      });
      // En caso no devuelva 0 significa que no existe por lo cual vamos a registrarlo
      if (notificactionRegister[1] == 0) {
        await this.notificacionRepository.save({
          codUser: codUser,
          tokenPush: createNotificacionDto.tokenPush,
        });
      }
    } catch (error) {
      this.logger.error(`Sucedio un error al guardar el token`, error);
      return { message: 'Sucedio un error al guardar el token' };
    }

    this.logger.log('Se guardo el Token Task To User');
    return { message: Constant.MENSAJE_OK, info: 'Se guardo el token exitosamente' };
  }

  async save(tokenPush: string, codUser: number) {
    this.logger.log(`Suscribiendo el token para el usuario ${codUser}`);
    return await this.notificacionRepository.save({
      codUser: codUser,
      tokenPush: tokenPush,
    });
  }

  async sendNotification(tokenPush: string, message: Object) {
    this.logger.log('Envio Notificacion al token  el valor es', tokenPush);
    webpush
      .sendNotification(JSON.parse(tokenPush), JSON.stringify(message))
      .then((res) => {
        this.logger.log('Enviado !!', res);
      })
      .catch((err) => {
        this.logger.warn('Fallo Enviar StatusCode: ' + err.statusCode, err.body);
      });
  }

  async findTokensByUser(codUser) {
    return await this.notificacionRepository
      .createQueryBuilder('NOTIFICACION')
      .select('DISTINCT   (NOTIFICACION.tokenPush)', 'tokenPush')
      .innerJoin(User, 'USER', ' USER.id = NOTIFICACION.codUser')
      .where('USER.id = :id', {
        id: codUser,
      })
      .getRawMany();
  }

  async findTokensByTask(codTask) {
    return await this.notificacionRepository
      .createQueryBuilder('NOTIFICACION')
      .select('DISTINCT   (NOTIFICACION.tokenPush)', 'tokenPush')
      .innerJoin(User, 'USER', ' USER.id = NOTIFICACION.codUser')
      .innerJoin(TaskToUser, 'TASK_TO_USER', ' TASK_TO_USER.codUser = USER.id')
      .where('TASK_TO_USER.codTask = :codTask', {
        codTask: codTask,
      })
      .getRawMany();
  }

  async registerTaskTokenByUser(listaUsers: User[]) {
    this.logger.log('Obteniendo Tokens para la nueva tarea creada');
    let arrayTokenUsers: any[] = [];
    try {
      for (let user of listaUsers) {
        try {
          arrayTokenUsers.push(await this.findTokensByUser(user.id));
        } catch (error) {
          this.logger.error('Error al obtener token del usuario', error);

          return {
            message: 'Error al obtener token del usuario',
          };
        }
      }

      this.logger.log('Despues del Lop soy el arrayTokens cantidad', arrayTokenUsers.length);

      for (let tokens of arrayTokenUsers) {
        for (let token of tokens) {
          this.logger.log('Llegue aca el token push es ', token);
          this.sendNotification(token.tokenPush, Constant.NOTIFICACION_NEW_TASK);
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

  
}
