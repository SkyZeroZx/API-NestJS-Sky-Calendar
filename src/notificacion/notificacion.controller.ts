import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { NotificacionService } from './notificacion.service';
import { CreateNotificacionDto } from './dto/create-notificacion.dto';
import { UpdateNotificacionDto } from './dto/update-notificacion.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/common/decorators/user.decorator';
import { User as UserEntity } from 'src/user/entities/user.entity';
import { SendNotificacionDto } from './dto/send-notificacion.dto';

@ApiTags('Notificaciones')
@Controller('notificacion')
export class NotificacionController {
  constructor(private readonly notificacionService: NotificacionService) {}
  private readonly logger = new Logger(NotificacionController.name);

  @UseGuards(JwtAuthGuard)
  @Post()
  async save(@User() user: UserEntity, @Body() createNotificacionDto: CreateNotificacionDto) {
    this.logger.log(`Guardando Token para el usuario usuario ${user.username}`);
    return await this.notificacionService.suscribeNotification(user.id, createNotificacionDto);
  }


  @UseGuards(JwtAuthGuard)
  @Post('/send')
  async registerTaskTokenByUser(@Body() sendNotificacionDto: SendNotificacionDto) {
    this.logger.log(`Enviando notificaciones de nueva tarea creada a los usuarios `);
    return await this.notificacionService.registerTaskTokenByUser(sendNotificacionDto.users , sendNotificacionDto.taskToUser);
  }



  @Get()
  findAll() {
    return this.notificacionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.notificacionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNotificacionDto: UpdateNotificacionDto) {
    return this.notificacionService.update(+id, updateNotificacionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notificacionService.remove(+id);
  }


  @Post('tokens')
  obtenerTokens(@Body() tokens : any){
    console.log('Envie' , tokens.codTask)
    const result = this.notificacionService.findTokensByTask(tokens.codTask);
    return result;
  }
}
