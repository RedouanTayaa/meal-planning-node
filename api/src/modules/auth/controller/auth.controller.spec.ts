import { AuthController } from './auth.controller';
import { AuthService } from '@auth/service/auth.service';
import { Test } from '@nestjs/testing';
import {
  LoginStatus,
  RegistrationStatus,
  Tokens,
} from '@auth/interface/auth.interface';
import { CreateUserDto } from '@user/interface/user.create.dto';
import { LoginUserDto } from '@user/interface/user.login.dto';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '@user/service/user.service';

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
          accessToken: '123456',
          refreshToken: '789012',
        };

        const tokens: Tokens = {
          accessToken: '123456',
          refreshToken: '789012',
        };
        switch (token) {
          case AuthService:
            return {
              register: jest.fn().mockResolvedValue(registerResult),
              login: jest.fn().mockResolvedValue(loginResult),
              createAccessTokenFromRefreshToken: jest
                .fn()
                .mockResolvedValue(tokens),
              removeRefreshToken: jest.fn().mockReturnValue(null),
            };
          case JwtService:
            return {
              verifyAsync: jest.fn().mockResolvedValue({ username: 'test' }),
            };
          case UserService:
            return {
              findByPayload: jest.fn().mockResolvedValue({ username: 'test' }),
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
        lastUpdate: null,
        refreshToken: null,
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
            accessToken: '123456',
            refreshToken: '789012',
          };
          switch (token) {
            case AuthService:
              return {
                register: jest.fn().mockResolvedValue(registerResult),
                login: jest.fn().mockResolvedValue(loginResult),
              };
            case JwtService:
              return {
                verifyAsync: jest.fn().mockResolvedValue({ username: 'test' }),
              };
            case UserService:
              return {
                findByPayload: jest
                  .fn()
                  .mockResolvedValue({ username: 'test' }),
              };
          }
        })
        .compile();

      const authControllerError = moduleRef.get(AuthController);
      const createUserDto: CreateUserDto = {
        username: 'test',
        password: '12345',
        email: 'test@meal.com',
        lastUpdate: null,
        refreshToken: null,
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
        accessToken: '123456',
        refreshToken: '789012',
      };

      expect(await authController.login(loginUserDto)).toStrictEqual(
        expectResult,
      );
    });

    it('should get new token', async () => {
      const expectResult: Tokens = {
        accessToken: '123456',
        refreshToken: '789012',
      };

      const req = {
        user: {
          username: 'test',
          refreshToken: '789012',
        },
      };

      expect(await authController.refreshTokens(req)).toStrictEqual(
        expectResult,
      );
    });
  });
});
