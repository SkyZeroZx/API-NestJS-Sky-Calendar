import { Body, Controller, Logger, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { User } from 'src/common/decorators/user.decorator';
import { User as UserEntity } from 'src/user/entities/user.entity';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Constant } from 'src/common/constants/Constant';
import { LoginDto } from './dtos/login.dto';
import { ResetUserDto } from './dtos/reset.dto';
import { ChangePasswordDto } from './dtos/changePasssword.dto';

@ApiTags('Autentificacion')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  private readonly logger = new Logger(AuthController.name);

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() loginDto: LoginDto, @User() user: UserEntity) {
    this.logger.log('Retornando datos');
    // Segun el estado de nuestro usuario retornamos una respuesta
    switch (user.estado) {
      case Constant.ESTADOS_USER.CREADO:
      case Constant.ESTADOS_USER.HABILITADO:
      case Constant.ESTADOS_USER.RESETEADO:
        const data = this.authService.generateToken(user);
        Object.assign(data, { message: Constant.MENSAJE_OK });
        return data;
      default:
        return { message: 'El usuario tiene un estado ' + user.estado };
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('reset-password')
  async resetPassword(@Body() resetUserDto: ResetUserDto) {
    this.logger.log(`Reseteando usuario ${resetUserDto.username}`);
    // Validamos la existencia del campo
    const { username } = resetUserDto;
    if (!username) {
      this.logger.warn('Se requiere username');
      return { message: 'Se requiere username' };
    }
    return this.authService.resetPassword(username);
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  async changePassword(@Body() changePasswordDto: ChangePasswordDto, @User() user: UserEntity) {
    this.logger.log(`Cambiando contraseña usuario ${user.username}`);
    // Obtenemos las contraseña antigua y nueva de nuestro ChangePasswordDto
    const { oldPassword, newPassword } = changePasswordDto;
    // Validamos que existan las nueva y antigua contraseña
    if (!(oldPassword && newPassword)) {
      this.logger.warn('Contraseña antigua y nueva son requeridas');
      return { message: 'Contraseña antigua y nueva son requeridas' };
    }
    //Realizamos validaciones
    if (oldPassword == newPassword) {
      this.logger.warn('No puede repetir la contraseña antigua para la nueva contraseña');
      return { message: 'No puede repetir la contraseña antigua para la nueva contraseña' };
    }

    user.password = newPassword;
    // En caso sea el primer cambio de contraseña o reseteado cambiamos el estado a false
    user.firstLogin = false;
    // Al ser cambio de contraseña el estado pasa a ser habilitado
    user.estado = Constant.ESTADOS_USER.HABILITADO;

    return this.authService.changePassword(user, oldPassword);
  }
}
