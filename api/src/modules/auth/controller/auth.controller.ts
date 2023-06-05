import {
  Controller,
  Body,
  Get,
  Post,
  HttpException,
  HttpStatus,
  HttpCode,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../service/auth.service';
import { CreateUserDto } from '@user/interface/user.create.dto';
import {
  LoginStatus,
  RegistrationStatus,
} from '@auth/interface/auth.interface';
import { LoginUserDto } from '@user/interface/user.login.dto';
import { AuthGuard } from '@auth/service/auth.guard';
import { UserService } from '@user/service/user.service';
import { RefreshTokenGuard } from '@auth/service/refreshToken.guard';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Create user' })
  public async register(
    @Body() createUserDto: CreateUserDto,
  ): Promise<RegistrationStatus> {
    const result: RegistrationStatus = await this.authService.register(
      createUserDto,
    );
    if (!result.success) {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
    }
    return result;
  }

  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Login' })
  @ApiResponse({ status: 200 })
  public async login(@Body() loginUserDto: LoginUserDto): Promise<LoginStatus> {
    return await this.authService.login(loginUserDto);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  @ApiOperation({ summary: 'Get new token from refresh token' })
  refreshTokens(@Request() req) {
    const refreshToken = req.user.refreshToken;
    return this.authService.createAccessTokenFromRefreshToken(refreshToken);
  }

  @Get('logout')
  @ApiOperation({ summary: 'Logout' })
  @UseGuards(AuthGuard)
  @HttpCode(200)
  async logOut(@Request() req) {
    await this.userService.removeRefreshToken(req.user.username);
    req.res.setHeader('Authorization', null);
  }
}
