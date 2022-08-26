import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Constant } from '../common/constants/Constant';
import { transporter } from '../config/mailer';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { DeleteUserDto } from './dto/delete-user.dto';
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

    let user = createUserDto as User;
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
      this.logger.error(`Sucedio un error al crear al usuario ${createUserDto.username}`, {
        error,
      });
      throw new InternalServerErrorException({ message: 'Sucedio un error al crear al usuario' });
    }

    try {
      await transporter.sendMail({
        from: 'Sky <institucional@gmail.com>',
        to: createUserDto.username,
        subject: 'Creacion de nuevo usuario',
        html: Constant.replaceText(
          ['{{username}}', '{{randomPassword}}'],
          [createUserDto.username, generatePassword],
          Constant.MAIL.CREATE_NEW_USER,
        ),
      });
      this.logger.log(
        `Correo de creacion del usuario ${createUserDto.username} enviado exitosamente`,
      );
    } catch (error) {
      this.logger.error(' Hubo un error al enviar el correo de creacion', {
        error,
      });
      throw new InternalServerErrorException({
        message: 'Hubo un error al enviar el correo de creacion',
      });
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
      throw new InternalServerErrorException({ message: 'Sucedio un error' });
    }
    return { message: Constant.MENSAJE_OK };
  }

  async findAll() {
    return this.userRepository.find();
  }

  async update(updateUserDto: UpdateUserDto) {
    try {
      const userUpdate = this.userRepository.create({
        nombre: updateUserDto.nombre,
        apellidoMaterno: updateUserDto.apellidoMaterno,
        apellidoPaterno: updateUserDto.apellidoPaterno,
        role: updateUserDto.role,
        estado: updateUserDto.estado,
      });
      await this.userRepository.update(updateUserDto.id, userUpdate);
    } catch (error) {
      this.logger.error(`Sucedio un error al actualizar al usuario ${updateUserDto.username}`, {
        error,
      });
      throw new InternalServerErrorException({
        message: 'Sucedio un error al actualizar al usuario',
      });
    }

    this.logger.log(`Se actualizo exitosamente el usuario`, { updateUserDto });
    return {
      message: Constant.MENSAJE_OK,
      info: 'Usuario Actualizado Correctamente',
    };
  }

  async remove(deleteUserDto: DeleteUserDto) {
    try {
      await this.userRepository.delete(deleteUserDto.id);
    } catch (error) {
      this.logger.error(`Sucedio un error al eliminar al usuario`, { deleteUserDto }, { error });
      throw new InternalServerErrorException({
        message: 'Sucedio un error al eliminar al usuario',
      });
    }

    this.logger.log('Se elimino exitosamente al usuario ', { deleteUserDto });
    return {
      message: Constant.MENSAJE_OK,
      info: 'Usuario Eliminado Correctamente'
    };
  }

  async getUserById(userId: number) {
    this.logger.log(`Buscando usuario con id ${userId}`);
    try {
      return await this.userRepository.findOneOrFail({
        where: { id: userId },
      });
    } catch (error) {
      this.logger.error(`Sucedio un error al buscar el usuario con id ${userId}`);
      this.logger.error(error);
      throw new InternalServerErrorException({
        message: 'Sucedio un error al buscar el usuario',
      });
    }
  }

  async saveNewPassword(user: User) {
    try {
      // Hasheamos nuestra contraseña
      const userCreateNewPassword = this.userRepository.create({
        username: user.username,
        password: user.password,
        firstLogin: user.firstLogin,
        estado: user.estado,
      });
      userCreateNewPassword.hashPassword();
      // Llamamos nuestro userRepository y creamos nuestra query Update
      const userNewPassword = await this.userRepository
        .createQueryBuilder()
        .update(User)
        .set({
          password: userCreateNewPassword.password,
          firstLogin: userCreateNewPassword.firstLogin,
          estado: userCreateNewPassword.estado,
        })
        .where('username = :username', { username: userCreateNewPassword.username })
        .execute();
      // Validamos que se actualice con el valor de affected
      if (userNewPassword.affected == 1) {
        this.logger.log(`Se cambio satisfactoriamente la contraseña del usuario ${user.username}`);
        return { message: Constant.MENSAJE_OK, info: 'Se cambio exitosamente la contraseña' };
      } else {
        // Caso contrario retornamos un error
        this.logger.warn(`Sucedio un error al cambiar la contraseña , usuario : ${user.username}`);
        return { message: 'Sucedio un error al cambiar la contraseña' };
      }
    } catch (error) {
      this.logger.error(`Sucedio un error al cambiar la contraseña del usuario ${user.username}`);
      this.logger.error(error);
      throw new InternalServerErrorException({
        message: 'Sucedio un error al cambiar la contraseña',
      });
    }
  }
}
