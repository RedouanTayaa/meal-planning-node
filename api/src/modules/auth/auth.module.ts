import { Module } from '@nestjs/common';
import { UserModule } from '@user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';
import { JwtStrategy } from './service/jwt.strategy';
import { AuthGuard } from '@auth/service/auth.guard';
import { RefreshStrategy } from '@auth/service/refresh.strategy';
import { RefreshTokenGuard } from '@auth/service/refreshToken.guard';

@Module({
  imports: [
    UserModule,
    PassportModule.register({
      defaultStrategy: 'jwt',
      property: 'user',
      session: false,
    }),
    JwtModule.register({}),
    ConfigModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    RefreshStrategy,
    AuthGuard,
    RefreshTokenGuard,
  ],
  exports: [PassportModule, JwtModule],
})
export class AuthModule {}
