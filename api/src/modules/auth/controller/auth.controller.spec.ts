import { AuthController } from './auth.controller';
import { AuthService } from '@auth/service/auth.service';
import { Test } from '@nestjs/testing';
import {
  LoginStatus,
  RegistrationStatus,
} from '@auth/interface/auth.interface';
import { CreateUserDto } from '@user/interface/user.create.dto';
import { LoginUserDto } from '@user/interface/user.login.dto';
import { HttpException } from '@nestjs/common';

describe('AuthController', () => {
  let authController: AuthController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
    })
      .useMocker((token) => {
        const registerResult: RegistrationStatus = {
          success: true,
          message: 'user registered',
        };
        const loginResult: LoginStatus = {
          username: 'test',
          token: '123456',
        };
        if (token === AuthService) {
          return {
            register: jest.fn().mockResolvedValue(registerResult),
            login: jest.fn().mockResolvedValue(loginResult),
          };
        }
      })
      .compile();

    authController = moduleRef.get(AuthController);
  });

  describe('root', () => {
    it('should register user', async () => {
      const createUserDto: CreateUserDto = {
        username: 'test',
        password: '12345',
        email: 'test@meal.com',
      };

      const expectResult: RegistrationStatus = {
        success: true,
        message: 'user registered',
      };

      expect(await authController.register(createUserDto)).toStrictEqual(
        expectResult,
      );
    });

    it('should throw an error register user', async () => {
      const moduleRef = await Test.createTestingModule({
        controllers: [AuthController],
      })
        .useMocker((token) => {
          const registerResult: RegistrationStatus = {
            success: false,
            message: 'error',
          };
          const loginResult: LoginStatus = {
            username: 'test',
            token: '123456',
          };
          if (token === AuthService) {
            return {
              register: jest.fn().mockResolvedValue(registerResult),
              login: jest.fn().mockResolvedValue(loginResult),
            };
          }
        })
        .compile();

      const authControllerError = moduleRef.get(AuthController);
      const createUserDto: CreateUserDto = {
        username: 'test',
        password: '12345',
        email: 'test@meal.com',
      };

      await authControllerError.register(createUserDto).catch((reason) => {
        expect(reason.message).toBe('error');
      });
    });

    it('should login user', async () => {
      const loginUserDto: LoginUserDto = {
        username: 'test',
        password: '12345',
      };

      const expectResult: LoginStatus = {
        username: 'test',
        token: '123456',
      };

      expect(await authController.login(loginUserDto)).toStrictEqual(
        expectResult,
      );
    });
  });
});
