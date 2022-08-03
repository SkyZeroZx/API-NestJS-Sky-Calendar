import { Reflector } from '@nestjs/core';
import { CanActivate, ExecutionContext, Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { User } from '../../user/entities/user.entity';
 export const META_ROLES = 'role';

@Injectable()
export class UserRoleGuard implements CanActivate {
  
  constructor(
    private readonly reflector: Reflector
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const validRoles: string = this.reflector.get( META_ROLES , context.getHandler() )
 
     if ( !validRoles ) return true;
    if ( validRoles.length === 0 ) return true;
    
    const req = context.switchToHttp().getRequest();
    const user = req.user as User;
 
    console.log('user ' , user)
    if ( !user ) 
      throw new BadRequestException('User not found');

    console.log('User Role is' , user.role)
    console.log('Rol validate ' , validRoles)
    if ( validRoles == user.role){
        return true;
    }
    
    throw new ForbiddenException(
      `User ${ user.username } need a valid role: [${ validRoles }]`
    );
  }
}
