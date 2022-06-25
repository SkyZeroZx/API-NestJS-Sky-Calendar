import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/user/user.module';
 import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
 import { JwtStrategy } from './strategies/jwt.stragegy';
import { LocalStrategy } from './strategies/local.strategy';
import { JWT_TOKEN } from 'src/common/constants/Constant';
 
@Module({
  imports: [
    PassportModule,
    UserModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory:(config : ConfigService) =>({
        secret : config.get<string>(JWT_TOKEN),
        signOptions: {expiresIn:'24h'}
      })
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy , JwtStrategy],

})
export class AuthModule {}