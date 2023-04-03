import { UserEntity } from '../modules/user/entity/user.entity';
import { UserDto } from '../modules/user/interface/user.dto';

export const toUserDto = (data: UserEntity): UserDto => {
  const { id, username, email } = data;
  return { id, username, email };
};

export interface RegistrationStatus {
  success: boolean;
  message: string;
}

export interface JwtPayload {
  username: string;
}

export interface LoginStatus {
  username: string;
  token: string;
}
