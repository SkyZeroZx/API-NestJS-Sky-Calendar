import { Controller, Post, Body, UseGuards, Logger } from '@nestjs/common';
import { NotificacionService } from './notificacion.service';
import { CreateNotificacionDto } from './dto/create-notificacion.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../common/decorators/user.decorator';
import { User as UserEntity } from '../user/entities/user.entity';
import { SendNotificacionDto } from './dto/send-notificacion.dto';

@ApiTags('Notificaciones')
@Controller('notificacion')
export class NotificacionController {
  constructor(private readonly notificacionService: NotificacionService) {}
  private readonly logger = new Logger(NotificacionController.name);

  @UseGuards(JwtAuthGuard)
  @Post()
  async registerSuscriptionNotification(
    @User() user: UserEntity,
    @Body() createNotificacionDto: CreateNotificacionDto,
  ) {
    this.logger.log(`Guardando Token para el usuario logeado ${user.username}`);
    return this.notificacionService.suscribeNotification(user.id, createNotificacionDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/send')
  async registerTaskTokenByUser(@Body() sendNotificacionDto: SendNotificacionDto) {
    this.logger.log(`Enviando notificaciones de nueva tarea creada a los usuarios `);

    return this.notificacionService.registerTaskTokenByUser(sendNotificacionDto.users);
  }
}
