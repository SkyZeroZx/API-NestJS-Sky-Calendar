import { Constant } from '../common/constants/Constant';
import { CreateUserDto } from './dto/create-user.dto';
import { DeleteUserDto } from './dto/delete-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

export class UserServiceMock {
  public async save(_dto: any): Promise<any> {
    return UserServiceMock.mockResultCreateUser;
  }

  public find = jest.fn().mockReturnThis();
  public create = jest.fn().mockReturnThis();
  public findOneOrFail = jest.fn().mockReturnThis();
  public delete = jest.fn().mockReturnThis();
  // Metodo mockeado de TypeORM createQueryBuilder
  public createQueryBuilder = jest.fn(() => ({
    where: this.where,
    addSelect: this.addSelect,
    getOne: this.getOne,
    offset: this.offset,
    limit: this.limit,
    update: this.update,
    set: this.set,
    execute: this.execute,
  }));

  // Mockeo para funciones del QueryBuilder
  public where = jest.fn().mockReturnThis();
  public addSelect = jest.fn().mockReturnThis();
  public getOne = jest.fn().mockReturnThis();
  public offset = jest.fn().mockReturnThis();
  public limit = jest.fn().mockReturnThis();
  public update = jest.fn().mockReturnThis();
  public set = jest.fn().mockReturnThis();
  public execute = jest.fn().mockReturnThis();

  // Mockeo de objetos
  public static mockCreateDto: CreateUserDto = {
    username: 'SkyZeroZx',
    nombre: 'Jaime',
    apellidoMaterno: 'Burgos',
    apellidoPaterno: 'Tejada',
    role: 'Admin',
  };

  public static mockResultCreateUser: User = {
    id: 1,
    username: 'SkyZeroZx',
    nombre: 'Jaime',
    password: 'test1',
    apellidoMaterno: 'Burgos',
    apellidoPaterno: 'Tejada',
    role: 'Admin',
    estado: 'CREADO',
    firstLogin: true,
    createdAt: new Date(),
    updateAt: new Date(),
    hashPassword: function (): Promise<void> {
      return;
    },
    firstLoginStatus: function (): Promise<void> {
      return;
    },
  };

  public static mockResultOk = {
    message: Constant.MENSAJE_OK,
  };

  public static updateUser: UpdateUserDto = {
    id: 1,
    username: 'SkyZeroZx',
    nombre: 'Jaime',
    apellidoMaterno: 'Burgos',
    apellidoPaterno: 'Tejada',
    role: 'Admin',
    estado: 'CREADO',
  };

  public static deleteUser: DeleteUserDto = {
    id: 1,
  };

  public static readonly mockFindAllUserData: User[] = [
    {
      id: 1,
      username: 'SkyZeroZx',
      nombre: 'Jaime',
      password: 'test1',
      apellidoMaterno: 'Burgos',
      apellidoPaterno: 'Tejada',
      role: 'Admin',
      createdAt: new Date(),
      updateAt: new Date(),
      estado: 'CREADO',
      firstLogin: false,
      hashPassword: Object,
      firstLoginStatus: Object,
    },
    {
      id: 2,
      username: 'Test User 2',
      nombre: 'User',
      password: 'test2',
      apellidoMaterno: 'User Materno 2',
      apellidoPaterno: 'Paterno 2',
      role: 'viewer',
      createdAt: new Date(),
      updateAt: new Date(),
      estado: 'BLOQUEADO',
      firstLogin: false,
      hashPassword: Object,
      firstLoginStatus: Object,
    },
  ];
}
