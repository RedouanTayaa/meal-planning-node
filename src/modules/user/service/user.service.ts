import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '@user/entity/user.entity';
import { toUserDto } from '@shared/mapper';
import { UserDto } from '../interface/user.dto';
import { LoginUserDto } from '@user/interface/user.login.dto';
import { CreateUserDto } from '@user/interface/user.create.dto';

const bcrypt = require('bcrypt');

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  findAll(): Promise<UserEntity[]> {
    return this.usersRepository.find();
  }

  async findOne(options?: object): Promise<UserDto> {
    const user = await this.usersRepository.findOne(options);

    if (!user) {
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    }
    return toUserDto(user);
  }

  async findByLogin({ username, password }: LoginUserDto): Promise<UserDto> {
    const user = await this.usersRepository.findOne({ where: { username } });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    }

    const areEqual = await this.comparePasswords(user.password, password);

    if (!areEqual) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    return toUserDto(user);
  }

  async findByPayload({ username }): Promise<UserDto> {
    return await this.findOne({ where: { username } });
  }

  async create(userDto: CreateUserDto): Promise<UserDto> {
    const { username, password, email } = userDto;

    const userInDb = await this.usersRepository.findOne({
      where: { username },
    });
    if (userInDb) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    const user: UserEntity = await this.usersRepository.create({
      username,
      password,
      email,
    });
    await this.usersRepository.save(user);

    return toUserDto(user);
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async comparePasswords(actualPassword, checkPassword): Promise<boolean> {
    return await bcrypt.compare(checkPassword, actualPassword);
  }
}
