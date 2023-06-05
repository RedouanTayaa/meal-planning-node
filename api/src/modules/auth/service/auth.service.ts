import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '@user/service/user.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '@user/interface/user.create.dto';
import {
  JwtPayload,
  LoginStatus,
  RegistrationStatus,
  Tokens,
} from '@auth/interface/auth.interface';
import { LoginUserDto } from '@user/interface/user.login.dto';
import { UserDto } from '@user/interface/user.dto';

const bcrypt = require('bcrypt');

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(userDto: CreateUserDto): Promise<RegistrationStatus> {
    let status: RegistrationStatus = {
      success: true,
      message: 'user registered',
    };
    try {
      const user = await this.usersService.create(userDto);
      const tokens = await this.getTokens({ username: user.username });
      await this.usersService.setCurrentRefreshToken(
        tokens.refreshToken,
        user.id,
      );
    } catch (err) {
      status = {
        success: false,
        message: err,
      };
    }
    return status;
  }

  async login(loginUserDto: LoginUserDto): Promise<LoginStatus> {
    const user = await this.usersService.findByLogin(loginUserDto);
    const tokens = await this.getTokens({ username: user.username });
    await this.usersService.setCurrentRefreshToken(
      tokens.refreshToken,
      user.id,
    );

    return {
      username: user.username,
      ...tokens,
    };
  }

  async getTokens({ username }): Promise<Tokens> {
    const jwtPayload: JwtPayload = {
      username: username,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: process.env.JWT_SECRET,
        expiresIn: '6h',
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '7d',
      }),
    ]);

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  async createAccessTokenFromRefreshToken(refreshToken: string) {
    const decoded = this.jwtService.decode(refreshToken) as JwtPayload;
    if (!decoded) {
      throw new HttpException(
        'Invalid token',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const user = await this.usersService.findByPayload({
      username: decoded.username,
    });
    if (!user) {
      throw new HttpException(
        'User with this username does not exist',
        HttpStatus.NOT_FOUND,
      );
    }

    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );
    if (!isRefreshTokenMatching) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }

    const tokens = await this.getTokens(user);
    await this.usersService.setCurrentRefreshToken(
      tokens.refreshToken,
      user.id,
    );

    return tokens;
  }

  async validateUser(payload: JwtPayload): Promise<UserDto> {
    const user = await this.usersService.findByPayload(payload);
    if (!user) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }
}
