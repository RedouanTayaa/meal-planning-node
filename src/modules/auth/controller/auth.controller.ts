import {
  Controller,
  Body,
  Post,
  HttpException,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { CreateUserDto } from '@user/interface/user.create.dto';
import {
  LoginStatus,
  RegistrationStatus,
} from '@auth/interface/auth.interface';
import { LoginUserDto } from '@user/interface/user.login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
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
  public async login(@Body() loginUserDto: LoginUserDto): Promise<LoginStatus> {
    return await this.authService.login(loginUserDto);
  }
}
