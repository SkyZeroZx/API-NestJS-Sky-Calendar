import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Constant, JWT_TOKEN } from '../../common/constants/Constant';
import { UserService } from '../../user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);
  constructor(private userService: UserService, private config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>(JWT_TOKEN),
    });
  }

  async validate(payload: any) {
    const user = await this.userService.getUserById(payload.userId);
    switch (user.estado) {
      case Constant.ESTADOS_USER.HABILITADO:
      case Constant.ESTADOS_USER.RESETEADO:
      case Constant.ESTADOS_USER.CREADO:
        return user;
      default:
        this.logger.warn(`Su usuario no se encuentra autorizado`, user , payload);
        throw new UnauthorizedException({
          message: `Su usuario no se encuentra autorizado , tiene un status ${user.estado}`,
        });
    }
  }
}
