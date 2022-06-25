import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Constant } from 'src/common/constants/Constant';
import { transporter } from 'src/config/mailer';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { DeleteUserDto } from './dto/delete-user-dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { generate } from 'generate-password';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const message = (await this.findByEmail(createUserDto.username)).message;
    if (message !== Constant.MENSAJE_OK) {
      return { message: message };
    }

    let user: any = createUserDto;
    let generatePassword;
    try {
      generatePassword = generate({
        length: 10,
        numbers: true,
      });
      user.password = generatePassword;
      const newUser = this.userRepository.create(user);
      user = await this.userRepository.save(newUser);
    } catch (error) {
      this.logger.error(`Sucedio un error al crear al usuario ${createUserDto.username}`, { error });
      return { message: 'Sucedio un error al crear al usuario' };
    }

    try {
      await transporter.sendMail({
        from: 'Universidad <institucional@gmail.com>',
        to: createUserDto.username,
        subject: 'Creacion de nuevo usuario',
        html: Constant.replaceText(['{{username}}', '{{randomPassword}}'], [createUserDto.username, generatePassword], Constant.MAIL.CREATE_NEW_USER),
      });
      this.logger.log(`Correo de creacion del usuario ${createUserDto.username} enviado exitosamente`);
    } catch (error) {
      this.logger.error(' Hubo un error al enviar el correo de creacion', {
        error,
      });
      return { message: 'Hubo un error al enviar el correo de creacion' };
    }

    delete user.password;
    this.logger.log(`Usuario creado exitosamente`, { user });
    return {
      message: Constant.MENSAJE_OK,
      info: 'Usuario Creado Correctamente',
      user,
    };
  }

  async findByEmail(email: string) {
    let user: User;
    try {
      user = await this.userRepository
        .createQueryBuilder('user')
        .where({
          username: email,
        })
        .addSelect('user.password')
        .getOne();
      if (user) {
        this.logger.log(`El correo del usuario ${email} se encuentra registrado`);
        return {
          message: 'El correo del usuario ya existe',
          user,
        };
      }
    } catch (error) {
      this.logger.error(`Sucedio un error al realizar la busqueda del usuario ${email}`, { error });
      return { message: 'Sucedio un error' };
    }
    return { message: Constant.MENSAJE_OK };
  }

  async findAll() {
    return this.userRepository.find();
  }

  async update(updateUserDto: UpdateUserDto) {
    let userUpdate;
    try {
      userUpdate = await this.userRepository.findOneOrFail({
        where: {
          id: parseInt(updateUserDto.id),
        },
      });
    } catch (error) {
      this.logger.error(`Sucedio un error al actualizar al usuario ${updateUserDto.username}`);
      this.logger.error(error);
      return { message: 'Usuario no encontrado' };
    }

    userUpdate = updateUserDto;
    userUpdate.id = parseInt(updateUserDto.id);
    switch (updateUserDto.estado) {
      case Constant.ESTADOS_USER.CREADO:
        userUpdate.firstLogin = true;
        break;
      case Constant.ESTADOS_USER.RESETEADO:
        userUpdate.firstLogin = true;
        break;
      case Constant.ESTADOS_USER.HABILITADO:
        userUpdate.firstLogin = false;
        break;
      default:
        userUpdate.firstLogin = true;
        break;
    }

    try {
      await this.userRepository
        .createQueryBuilder()
        .update(User)
        .set({
          nombre: userUpdate.nombre,
          apellidoMaterno: userUpdate.apellidoMaterno,
          apellidoPaterno: userUpdate.apellidoPaterno,
          role: userUpdate.role,
          firstLogin: userUpdate.firstLogin,
          estado: userUpdate.estado,
        })
        .where('id = :id', { id: userUpdate.id })
        .execute();
    } catch (error) {
      this.logger.error(`Sucedio un error al actualizar al usuario ${updateUserDto.username}`, { error });
      return { message: 'Sucedio un error al actualizar al usuario' };
    }

    this.logger.log(`Se actualizo exitosamente el usuario`, { userUpdate });
    return {
      message: Constant.MENSAJE_OK,
      info: 'Usuario Actualizado Correctamente',
      userUpdate,
    };
  }

  async remove(deleteUserDto: DeleteUserDto) {
    let user;
    try {
      user = await this.userRepository.findOneOrFail({
        where: {
          id: parseInt(deleteUserDto.id),
        },
      });
    } catch (error) {
      this.logger.error(`Sucedio un error al realizar la busqueda para eliminar al usuario codigo ${deleteUserDto.id}`, { error });
      return {
        message: 'Usuario a eliminar no encontrado',
      };
    }

    try {
      await this.userRepository.delete(parseInt(deleteUserDto.id));
    } catch (error) {
      this.logger.error(`Sucedio un error al eliminar al usuario`, { user }, { error });
      return { message: 'Sucedio un error al eliminar al usuario' };
    }

    this.logger.log('Se elimino exitosamente al usuario ', { user });
    return {
      message: Constant.MENSAJE_OK,
      info: 'Usuario Eliminado Correctamente',
      user,
    };
  }

  async getOne(userId) {
    this.logger.log('Buscando usuario con id ' + userId);
    try {
      return await this.userRepository.findOneOrFail({
        where: { id: userId },
      });
    } catch (error) {
      this.logger.error(`Sucedio un error al buscar el usuario con id ${userId}`);
      this.logger.error(`El error es ${error}`);
      return { message: 'Sucedio un error' };
    }
  }

  async saveNewPassword(user: User) {
    try {
      // Hasheamos nuestra contraseña
      user.hashPassword();
      // Llamamos nuestro userRepository y creamos nuestra query Update
      const userNewPassword = await this.userRepository
        .createQueryBuilder()
        .update(User)
        .set({ password: user.password, firstLogin: user.firstLogin, estado: user.estado })
        .where('id = :id', { id: user.id })
        .execute();
      // Validamos que se actualice con el valor de affected
      if (userNewPassword.affected == 1) {
        this.logger.log(`Se cambio satisfactoriamente la contraseña del usuario ${user.username}`);
        return { message: Constant.MENSAJE_OK, info: 'Se cambio exitosamente la contraseña' };
      } else {
        // Caso contrario retornamos un error
        this.logger.log(`Se cambio satisfactoriamente la contraseña del usuario ${user.username}`);
        return { message: 'Sucedio un error al cambiar la contraseña' };
      }
    } catch (error) {
      this.logger.error(`Sucedio un error al cambiar la contraseña del usuario ${user.username}`);
      this.logger.error(error);
      return { message: 'Sucedio un error al cambiar la contraseña' };
    }
  }
}
