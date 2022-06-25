import { Injectable, Logger } from '@nestjs/common';
import { Constant } from 'src/common/constants/Constant';
import { UserService } from 'src/user/user.service';
import { compare } from 'bcryptjs';
import { User } from 'src/user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { transporter } from 'src/config/mailer';
import { generate } from 'generate-password';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(private readonly jwtService: JwtService, private readonly userService: UserService) {}

  async validateUser(email: string, pass: string) {
    this.logger.log('Validando Usuario');
    const user = await this.userService.findByEmail(email);
    if (typeof user.user == 'undefined') {
      this.logger.log('Login fallido usuario: ' + email);
      return null;
    }

    if (user && (await compare(pass, user.user.password))) {
      delete user.message;
      user.message = Constant.MENSAJE_OK;
      delete user.user.password;
      this.logger.log('Login exitoso usuario: ' + email);
      return user.user;
    }
    return null;
  }

  async changePassword(user: User, oldPassword: string) {
    const findUser = await this.userService.findByEmail(user.username);
    if (user && (await compare(oldPassword, findUser.user.password))) {
      this.logger.log('Se valido que contraseña antigua coincide con la contraseña actual');
      return this.userService.saveNewPassword(user);
    }
    this.logger.warn('Antigua contraseña no coincidio con la contraseña actual');
    return { message: 'Hubo un error al cambiar la contraseña , validar' };
  }

  async resetPassword(username: string) {
    // Realizamos la busqueda de nuestro usuario
    let userReset = await this.userService.findByEmail(username);
    // Validamos que nos retorne diferente de undefined
    if (typeof userReset.user == 'undefined') {
      return { message: `Sucedio un error al resetear al usuario ${username}` };
    }
    // Generamos nuestra contraseña random
    let generatePassword = generate({
      length: 10,
      numbers: true,
    });
    // Asiganamos nuestra contraseña generada
    userReset.user.password = generatePassword;
    // Asigamos firstLogin TRUE y estado Reseteado
    userReset.user.firstLogin = true;
    userReset.user.estado = Constant.ESTADOS_USER.RESETEADO;
    // Salvamos la nueva contraseña con sus datos del usuario reseteado
    const resetUser = await this.userService.saveNewPassword(userReset.user);
    if (resetUser.message == Constant.MENSAJE_OK) {
      // Validamos la respuesta si es OK enviamos mail
      try {
        await transporter.sendMail({
          from: 'Universidad <institucional@gmail.com>',
          to: username,
          subject: 'Reseteo de contraseña',
          html: Constant.replaceText(['{{username}}', '{{passwordReset}}'], [username, generatePassword], Constant.MAIL.RESET_PASSWORD),
        });
        this.logger.log(`Se envio correo de reseteo del usuario ${username}`);
        return { message: Constant.MENSAJE_OK, info: 'Usuario reseteado exitosamente' };
      } catch (error) {
        this.logger.error('Hubo un error al enviar el correo de resteo');
        return {
          message: 'Hubo un error al enviar el correo de resteo',
        };
      }
    }
    //Caso contrario translamos el error
    return resetUser;
  }

  generateToken(user: User) {
    const payload = { userId: user.id, username: user.username, role: user.role, firstLogin: user.firstLogin };
    return {
      ...user,
      token: this.jwtService.sign(payload),
    };
  }
}