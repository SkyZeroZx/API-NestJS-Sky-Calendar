export class AuthResponse {
  public static readonly login = {
    status: 201,
    description: 'Login Exitoso',
    schema: {
      properties: {
        token: { type: 'string', description: 'Token generado por el servico' },
        username: { type: 'string', description: 'Correo del usuario' },
        role: { type: 'string', description: 'Rol del usuario' },
        createdAt: { type: 'string', description: 'Fecha de creacion del usuario' },
        updateAt: { type: 'string', description: 'Fecha de actualizacion del usuario' },
        nombre: { type: 'string', description: 'Nombre del usuario' },
        apellidoPaterno: { type: 'string', description: 'Apellido paterno del usuario' },
        apellidoMaterno: { type: 'string', description: 'Apeliido materno del usuario' },
        estado: { type: 'string', description: 'Estado del usuario' },
        firstLogin: { type: 'boolean', description: 'Determina el primer login o reseteo' },
      },
    },
  };

  public static readonly resetPassword = {
    status: 201,
    description: 'Reseteo de Contraseña Exitoso',
    schema: {
      properties: {
        message: { type: 'string', description: 'Mensaje de la operacion exitosa' },
        info: { type: 'string', description: 'Informacion adicional de la operacion' },
      },
    },
  };

  public static readonly changePassword = {
    status: 201,
    description: 'Cambio de Contraseña Exitoso',
    schema: {
      properties: {
        message: { type: 'string', description: 'Mensaje de la operacion exitosa' },
        info: { type: 'string', description: 'Informacion adicional de la operacion' },
      },
    },
  };
}
