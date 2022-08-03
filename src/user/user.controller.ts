import { Controller, Get, Post, Body, Patch, Delete, Logger, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { DeleteUserDto } from './dto/delete-user-dto';
import { Constant } from '../common/constants/Constant';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User as UserEntity } from '../user/entities/user.entity';
import { User } from '../common/decorators/user.decorator';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  private readonly logger = new Logger(UserController.name);

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    this.logger.log('Creando usuario');
    return this.userService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll() {
    this.logger.log('Listando Usuarios');
    const users = await this.userService.findAll();
    if (users.length === 0) {
      this.logger.warn('No se encontraron usuarios');
      return { message: 'No users found' };
    }
    this.logger.log(`Listado Usuario ${Constant.MENSAJE_OK}`);
    return users;
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async findByUser(@User() user: UserEntity) {
    this.logger.log('User JWT is ' , user.id);
 
    console.log(user);
    this.logger.log(`Usuario Obtenido ${Constant.MENSAJE_OK}`);
    return {message:Constant.MENSAJE_OK};
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  update(@Body() updateUserDto: UpdateUserDto) {
    this.logger.log('Actualizando usuario');
    return this.userService.update(updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  remove(@Body() deleteUserDto: DeleteUserDto) {
    this.logger.log('Eliminando usuario');
    return this.userService.remove(deleteUserDto);
  }
}
