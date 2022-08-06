import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Logger,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { User } from '../common/decorators/user.decorator';
import { User as UserEntity } from '../user/entities/user.entity';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Constant } from '../common/constants/Constant';
import { LoginDto } from './dtos/login.dto';
import { ResetUserDto } from './dtos/reset.dto';
import { ChangePasswordDto } from './dtos/changePasssword.dto';
import {
  generateAuthenticationOption,
  generateRegistrationOption,
  verifyAuthenticationOption,
  verifyAuthWeb,
} from '../config/webAuthn';

@ApiTags('Autentificacion')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  private readonly logger = new Logger(AuthController.name);

  rememberChallenge: any;

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() _loginDto: LoginDto, @User() user: UserEntity) {
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
        return { message: `El usuario tiene un estado ${user.estado}` };
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('generate-registration-options')
  async generateRegistration(@User() user: UserEntity) {
    this.logger.log('generate-registration-options');
    const userAuthenticators = await this.authService.getUserAuthenticators(user);
    const register = generateRegistrationOption(user, userAuthenticators);
    this.rememberChallenge = register.challenge;
    return register;
  }

  @UseGuards(JwtAuthGuard)
  @Post('verify-registration')
  async verifyRegistration(@Body() verify, @User() user: UserEntity) {
    this.logger.log('Verificando registro Authn Web');
    const verifyTest = await verifyAuthWeb(verify, this.rememberChallenge);
    return this.authService.saveUserAuthenticators(user, verify.id, verifyTest);
  }

  @Post('generate-authentication-options')
  async generateAuthenticationOptions(@Body() user) {
    this.logger.log('Generando Authentication Options Authn Web username', user.username);
    const userAuthenticators = await this.authService.getUserAuthenticatorsByUsername(
      user.username,
    );
    this.logger.log('userAuthenticators ', userAuthenticators);
    const authOptions = await generateAuthenticationOption(userAuthenticators);
    this.rememberChallenge = authOptions.challenge;
    this.logger.log('Se genero authOptions', authOptions);
    return authOptions;
  }

  @Post('verify-authentication')
  async verifityAuthentication(@Body() data) {
    this.logger.log('Se recibio', data);
    this.logger.log('Verificando Authentication Authn Web');
    let username = data.username;
    delete data.username;
    const userAuthenticators = await this.authService.getUserAuthenticatorsById(username, data.id);
    const verifyOptions = await verifyAuthenticationOption(
      data,
      this.rememberChallenge,
      userAuthenticators,
    );
    this.logger.log('verifyOptions', verifyOptions);
    if (verifyOptions['verified']) {
      Object.assign(verifyOptions, {
        data: await this.authService.generateTokenWithAuthnWeb(username),
      });
    }
    return verifyOptions;
  }

  @UseGuards(JwtAuthGuard)
  @Post('reset-password')
  async resetPassword(@Body() resetUserDto: ResetUserDto) {
    this.logger.log(`Reseteando usuario ${resetUserDto.username}`);
    const { username } = resetUserDto;
    return this.authService.resetPassword(username);
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  async changePassword(@Body() changePasswordDto: ChangePasswordDto, @User() user: UserEntity) {
    this.logger.log(`Cambiando contraseña usuario ${user.username}`);
    // Obtenemos las contraseña antigua y nueva de nuestro ChangePasswordDto
    const { oldPassword, newPassword } = changePasswordDto;
    //Realizamos validaciones
    if (oldPassword == newPassword) {
      this.logger.warn('No puede repetir la contraseña antigua para la nueva contraseña');
      throw new BadRequestException({
        message: 'No puede repetir la contraseña antigua para la nueva contraseña',
      });
    }
    user.password = newPassword;
    // En caso sea el primer cambio de contraseña o reseteado cambiamos el estado a false
    user.firstLogin = false;
    // Al ser cambio de contraseña el estado pasa a ser habilitado
    user.estado = Constant.ESTADOS_USER.HABILITADO;
    return this.authService.changePassword(user, oldPassword);
  }
}
