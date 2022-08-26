import { getSchemaPath } from '@nestjs/swagger';
import { User as UserEntity } from '../../../user/entities/user.entity';
export class AuthResponse {
  public static readonly login = {
    status: 201,
    description: 'Login Exitoso',
    schema: {
      properties: {
        token: { type: 'string' },
        user: { $ref: getSchemaPath(UserEntity) },
      },
    },
  };

  public static readonly resetPassword = {
    status: 201,
    description: 'Reseteo de Contraseña Exitoso',
    schema: {
      properties: {
        message: { type: 'string' , description : 'Mensaje de la operacion exitosa'},
        info: { type: 'string', description : 'Informacion adicional de la operacion' },
      },
    },
  };

  public static readonly changePassword = {
    status: 201,
    description: 'Cambio de Contraseña Exitoso',
    schema: {
      properties: {
        message: { type: 'string' , description : 'Mensaje de la operacion exitosa'},
        info: { type: 'string', description : 'Informacion adicional de la operacion' },
      },
    },
  };
}
