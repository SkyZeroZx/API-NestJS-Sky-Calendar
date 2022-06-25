import { RolesBuilder } from 'nest-access-control';

export enum AppRoles {
  estudiante = 'estudiante',
  admin = 'admin',
}


export enum AppResources {
        USER  = 'USER',
        TASK = 'TASK',
        TASKTOUSER  = 'TASKTOUSER',
        TYPE = 'TYPE',
        NOTIFICATION = 'NOTIFICATION'
  }

export const roles: RolesBuilder = new RolesBuilder();

roles.grant(AppRoles.admin)
.updateAny([AppResources.USER,AppResources.TASK,AppResources.TASKTOUSER,AppResources.TYPE,AppResources.NOTIFICATION])
.createAny([AppResources.USER,AppResources.TASK,AppResources.TASKTOUSER,AppResources.TYPE,AppResources.NOTIFICATION])
.deleteAny([AppResources.USER,AppResources.TASK,AppResources.TASKTOUSER,AppResources.TYPE,AppResources.NOTIFICATION]);