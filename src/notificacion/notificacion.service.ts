import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Constant } from '../common/constants/Constant';
import { TaskToUser } from '../task_to_user/entities/task_to_user.entity';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateNotificacionDto } from './dto/create-notificacion.dto';
import { Notificacion } from './entities/notificacion.entity';
import * as webpush from 'web-push';

@Injectable()
export class NotificacionService {
  private readonly logger = new Logger(NotificacionService.name);
  constructor(
    @InjectRepository(Notificacion)
    private readonly notificacionRepository: Repository<Notificacion>,
  ) {}

  async suscribeNotification(codUser: number, createNotificacionDto: CreateNotificacionDto) {
    this.logger.log('Suscribiendo el token para el usuario', createNotificacionDto);
    try {
      // Validamos si existe alguna coincidencia
      const [, count] = await this.notificacionRepository.findAndCount({
        where: {
          codUser: codUser,
          tokenPush: createNotificacionDto.tokenPush,
        },
      });
      // En caso no devuelva 0 significa que no existe por lo cual vamos a registrarlo
      if (count == 0) {
        await this.notificacionRepository.save({
          codUser: codUser,
          tokenPush: createNotificacionDto.tokenPush,
        });
      }
    } catch (error) {
      this.logger.error(`Sucedio un error al guardar el token`, error);
      throw new InternalServerErrorException({ message: 'Sucedio un error al guardar el token' });
    }

    this.logger.log('Se guardo el Token Task To User');
    return { message: Constant.MENSAJE_OK, info: 'Se guardo el token exitosamente' };
  }

  async sendNotification(tokenPush: string, message: Object) {
    this.logger.log('Envio Notificacion al token  el valor es', tokenPush);
    webpush
      .sendNotification(JSON.parse(tokenPush), JSON.stringify(message))
      .then((res) => {
        this.logger.log('Se envio notificacion ', res);
      })
      .catch((err) => {
        this.logger.warn(`Fallo al enviar notificacion statusCode : ${err.statusCode}`, err.body);
      });
  }

  async findTokensByUser(codUser: number) {
    return this.notificacionRepository
      .createQueryBuilder('NOTIFICACION')
      .select('DISTINCT   (NOTIFICACION.tokenPush)', 'tokenPush')
      .innerJoin(User, 'USER', ' USER.id = NOTIFICACION.codUser')
      .where('USER.id = :id', {
        id: codUser,
      })
      .getRawMany();
  }

  async findTokensByTask(codTask: number) {
    return this.notificacionRepository
      .createQueryBuilder('NOTIFICACION')
      .select('DISTINCT   (NOTIFICACION.tokenPush)', 'tokenPush')
      .innerJoin(User, 'USER', ' USER.id = NOTIFICACION.codUser')
      .innerJoin(TaskToUser, 'TASK_TO_USER', ' TASK_TO_USER.codUser = USER.id')
      .where('TASK_TO_USER.codTask = :codTask', {
        codTask: codTask,
      })
      .getRawMany();
  }

  async registerTaskTokenByUser(listUsers: User[]) {
    this.logger.log('Obteniendo Tokens para la nueva tarea creada');
    let tokensPerUser: any[] = [];
    try {

      listUsers.forEach((user) => {
        tokensPerUser.push(this.findTokensByUser(user.id));
      });

      tokensPerUser = await Promise.all(tokensPerUser);
      
      tokensPerUser.forEach((tokens) => {
        tokens.forEach((token) => {
          this.sendNotification(token.tokenPush, Constant.NOTIFICACION_NEW_TASK);
        });
      });

      this.logger.log('Notificaciones enviadas exitosamente');
      return {
        message: Constant.MENSAJE_OK,
        info: 'Notificaciones enviadas exitosamente',
      };
    } catch (error) {
      this.logger.error('Sucedio un error al registrar tokens para la nueva tarea', error);
      throw new InternalServerErrorException({
        message: 'Sucedio un error al registrar tokens para la nueva tarea',
      });
    }
  }
}
