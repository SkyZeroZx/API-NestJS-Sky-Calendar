import { InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthMockService } from '../../auth.mock.spec';

import { JwtAuthGuard } from '../jwt-auth.guard';
describe('JWT Guard ', () => {
  let jwtAuthGuard: JwtAuthGuard;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtAuthGuard],
    }).compile();

    jwtAuthGuard = module.get<JwtAuthGuard>(JwtAuthGuard);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(jwtAuthGuard).toBeDefined();
  });

  it('Validamos handleRequest', () => {
    // Validamos el caso OK
    let err: any = false;
    let info;
    let user = AuthMockService.userCreate;
    const handleRequestOk = jwtAuthGuard.handleRequest(err, user, info);
    expect(handleRequestOk).toEqual(user);
    // Validamos para el caso nos retorne un error
    user = undefined;
    err = new InternalServerErrorException('Algo salio mal');
    expect(() => {
      jwtAuthGuard.handleRequest(err, user, info);
    }).toThrow(err);

    err = false;
    expect(() => {
      jwtAuthGuard.handleRequest(err, user, info);
    }).toThrow(new UnauthorizedException('No te encuentras autenticado'));
  });
});
