import { UserEntity } from '@user/entity/user.entity';
import { UserDto } from '@user/interface/user.dto';

export const toUserDto = (data: UserEntity): UserDto => {
  const { id, username, email } = data;
  return { id, username, email };
};
